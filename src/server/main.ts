import { TData, TPrintRules, TAttachmenInfo } from '../common/types'
import _ from "lodash";
import * as imap from './imap-service'
import * as history from './history-service'
import * as rules from './rules.service'
import * as printer from './printer-service'

export const data: TData = {
  main: {
    dataDir: "./data/",
    attachmentsFileName: "processed-messages.json",
    rulesFileName: './print-rules.js'
  },
  imap: {
    imapConfig: {
      imap: {
        user: 'ela167@wp.pl',
        password: 'password',
        host: 'imap.wp.pl',
        port: 993,
        tls: true,
        authTimeout: 3000
      }
    },
    connection: undefined,
  },
  printRules: undefined,
  history: {
    storedAttachmentsInfo: undefined
  },
  printPreProcessor: {
    processed: {}
  },
};

export const getMain = () => data.main;
export const getImap = () => data.imap;
export const getHistory = () => data.history;

export const printEmails = async () => imap.process(await getImapConnection(), getPrintRules(), await getHistoryProcessedMessages())

export const getHistoryProcessedMessages = async () => {
  data.history.storedAttachmentsInfo = await history.readProcessedMessages(getMain(), getHistory())
  return data.history.storedAttachmentsInfo
}

export const getPrintRules = () => {
  data.printRules = rules.getPrintRules(getMain(), data.printRules)
  return data.printRules;
}

export const getImapConnection = async () => {
  data.imap.connection = await imap.getConnection(getImap());
  return data.imap.connection;
}

export const processAttachmentsAndSave = async () => {
  data.history.storedAttachmentsInfo = await history.writeProcessedMessages(getMain(), await printEmails())
  return data.history.storedAttachmentsInfo;
}

export const print = async () => {
  await printer.print(data.printPreProcessor)
}
