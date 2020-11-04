import { ImapSimple, Message } from 'imap-simple'
import { TAttachmenInfo } from '../common/types'
import * as imaps from 'imap-simple';
import _ from 'lodash';
import moment from "moment";

const config = {
  imap: {
    user: 'ela167@wp.pl',
    password: 'krak2b35',
    host: 'imap.wp.pl',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
};


export const getAttachmentsToProcess = async () => {
  const connection = await imaps.connect(config);
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
  const promises = _.flatMap<Message, Promise<TAttachmenInfo>>(messages, msg => {
    const headerPart = _.find(msg.parts, part => part.which?.toLowerCase() === 'header');
    const struct = msg.attributes.struct;
    if (!headerPart || !_.isArray(struct)) {
      return [];
    }

    const parts = imaps.getParts(struct);

    return _.chain(parts)
      .filter(part => part.disposition?.type?.toLowerCase() === 'attachment')
      .map(async part => {
        const timeStamp = moment().format();
        const subject: TAttachmenInfo['subject'] = _.first(headerPart.body.subject);
        const messageId: TAttachmenInfo['messageId'] = _.first(headerPart.body['message-id']) ?? timeStamp;
        const sentDateMmtUtc: TAttachmenInfo['sentDateMmtUtc'] = moment(_.first(headerPart.body.date)).format()
        const from: TAttachmenInfo['from'] = _.first(headerPart.body.from)
        const pdfBase64 = await connection.getPartData(msg, part);
        const fileName = part.disposition.params.filename;
        return {
          timeStamp,
          messageId,
          sentDateMmtUtc,
          from,
          subject,
          fileName,
          pdfBase64
        };
      })
      .value();
  });
  return Promise.all(promises);
}
