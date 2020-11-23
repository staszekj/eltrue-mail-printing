import { TData } from '../common/types'
import { TAttachmentInfo, TPrintResultCb } from '../common/types'
import _ from "lodash";
import * as history from './history-service'
import * as rules from './rules.service'
import * as printerService from './printer-service'

export const data: TData = {
  main: {
    dataDir: "./data/",
    attachmentsFileName: "processed-messages.json",
    rulesFileName: './print-rules.js'
  },
  imapConfig: {
    imap: {
      "ela167@wp.pl": {
        user: 'ela167@wp.pl',
        password: 'password',
        host: 'imap.wp.pl',
        port: 993,
        tls: true,
        authTimeout: 3000
      },
    },
  },
  printRules: undefined,
  history: {
    storedAttachmentsInfo: undefined
  }
};

export const getMain = () => data.main;
export const getHistory = () => data.history;

export const getHistoryProcessedMessages = async () => {
  data.history.storedAttachmentsInfo = await history.readProcessedMessages(getMain(), getHistory())
  return data.history.storedAttachmentsInfo
}

export const getPrintRules = () => {
  data.printRules = rules.getPrintRules(getMain(), data.printRules)
  return data.printRules;
}

export const print = async (printData: Array<TAttachmentInfo>, callback: TPrintResultCb): Promise<Array<TAttachmentInfo>> => {
    return printerService.print(data.main, printData, callback);
}
