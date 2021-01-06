import { TAttachmentInfo, TAttachmentInfoMap, TPrintResultCb, TPrintRules, TData } from '../common/types'
import _ from "lodash";
import * as history from './history-service'
import * as rulesService from './rules.service'
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

export const readProcessedMessages = async (): Promise<Array<TAttachmentInfo>> => {
  const attachmentInfoMap: TAttachmentInfoMap = await history.readProcessedMessages(data.main);
  return _.values(attachmentInfoMap);
}

export const process = async (callback?: TPrintResultCb): Promise<Array<TAttachmentInfo>> => {
  const attachmentInfoMap: TAttachmentInfoMap = await history.readProcessedMessages(data.main);
  const emailRulesFn: TPrintRules = rulesService.getPrintRules(data.main);
  const attachementInfoToPrint: Array<TAttachmentInfo> = _.values(attachmentInfoMap);
  const attachmentInfoPrinted = await printerService.print(attachementInfoToPrint, callback);
  history.writeProcessedMessages(data.main, attachmentInfoPrinted);
  return attachmentInfoPrinted;
}
