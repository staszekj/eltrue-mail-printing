import { ImapSimple, Message } from 'imap-simple'
import * as imaps from 'imap-simple';
import _ from 'lodash';


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

type TResult = { filename: string, data: string }

export const getMessages = async () => {
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');
  // Fetch emails from the last 24h
  const delay = 24 * 3600 * 1000;
  const yesterday = new Date();
  yesterday.setTime(Date.now() - delay);
  const yesterdayStr = yesterday.toISOString();
  const searchCriteria = ['UNSEEN', ['SINCE', yesterdayStr]];
  const fetchOptions = { struct: true };
  const messages = await connection.search(searchCriteria, fetchOptions);
  const promises = _.flatMap<Message, Promise<TResult>>(messages, msg => {
    if (!_.isArray(msg.attributes.struct)) {
      return [];
    }
    const parts = imaps.getParts(msg.attributes.struct);
    return _.chain(parts)
      .filter(part => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT')
      .filter(part => {
        console.log('msg', msg);
        console.log('part', part);
        return true;
      })
      .map(async part => {
        return {
          msgAttrs: msg.attributes,
          filename: part.disposition.params.filename,
          data: await connection.getPartData(msg, part)
        };
      })
      .value();
  });
  return Promise.all(promises);
}
