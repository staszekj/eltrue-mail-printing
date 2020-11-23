import { ImapSimple, Message, connect } from 'imap-simple'
import { TAttachmentInfo, TAttachmentInfoMap, TImapCfg, TPrintRules } from '../common/types'
import * as imaps from 'imap-simple';
import _ from 'lodash';
import moment from "moment";


export const getConnection = (imap: TImapCfg) => new Promise<ImapSimple>((success, fail) => {
  connect({ imap }, (err, res) => {
    if (err) return fail(err);
    success(res)
  });
});

export const process = async (historyProcesseMessages: TAttachmentInfoMap, printRules: TPrintRules, imap: Array<TImapCfg>) => {
  const connection  = await getConnection(imap[0]);
  await connection.openBox('INBOX');
  // Fetch emails from the last 24h
  const delay = 100 * 3600 * 1000;
  const yesterday = new Date();
  yesterday.setTime(Date.now() - delay);
  const yesterdayStr = yesterday.toISOString();
  const searchCriteria = [['SINCE', yesterdayStr]];
  const fetchOptions = {
    struct: true,
    bodies: ['HEADER'],
    markSeen: false
  };
  const messages = await connection.search(searchCriteria, fetchOptions);
  const promises = _.flatMap<Message, Promise<TAttachmentInfo>>(messages, msg => {
    const headerPart = _.find(msg.parts, part => part.which?.toLowerCase() === 'header');
    const struct = msg.attributes.struct;
    if (!headerPart || !_.isArray(struct)) {
      return [];
    }

    const parts = imaps.getParts(struct);

    return _.chain(parts)
      .filter(part => part.disposition?.type?.toLowerCase() === 'attachment')
      .map(async part => {
        const info: TAttachmentInfo = {
          timeStamp: moment().format(),
          messageId: _.first(headerPart.body['message-id']) ?? moment().format(),
          sentDateMmtUtc: moment(_.first(headerPart.body.date)).format(),
          from: _.first(headerPart.body.from),
          to: _.first(headerPart.body.to),
          subject: _.first(headerPart.body.subject) ?? "",
          fileName: part.disposition.params.filename
        }
        const prevAttachmentInfo = historyProcesseMessages[info.messageId];
        if (prevAttachmentInfo) {
          return prevAttachmentInfo;
        }
        const { reason, pagesRanges } = printRules.getPagesRanges(info);
        const infoWithRanges = {
          ...info,
          pagesRanges,
          reason,
        }
        if (!pagesRanges) {
          return infoWithRanges
        }
        return {
          ...infoWithRanges,
          pdfBase64: await connection.getPartData(msg, part)
        };
      })
      .value();
  });
  return Promise.all(promises);
}
