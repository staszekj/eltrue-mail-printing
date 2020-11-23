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
};

export const getMain = () => data.main;

export const getHistoryProcessedMessages = async () => {
  return await history.readProcessedMessages(getMain())
}

export const getPrintRules = () => {
  return rules.getPrintRules(getMain())
}

//todo
//call imap.process here. Compare with print

export const print = async (printData: Array<TAttachmentInfo>, callback?: TPrintResultCb): Promise<Array<TAttachmentInfo>> => {
    return printerService.print(data.main, printData, callback);
}
