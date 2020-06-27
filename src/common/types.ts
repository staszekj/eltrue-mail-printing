import { ImapSimple } from 'imap-simple'

export type TPrintStatus = 'PRINTING'

export type TAttachmenInfo = {
  messageId: string,
  timeStamp?: string;
  pagesRanges: string;
  reason?: string | null;
  status?: TPrintStatus;
  sentDateMmtUtc?: string;
  from?: string;
  to?: string;
  subject?: string,
  fileName?: string,
  pdfBase64: Buffer
}

export type TPrintRulesResult = {
  pagesRanges?: string,
  reason?: string
}

export type TPrintRules = {
  getPagesRanges: (info: TAttachmenInfo) => TPrintRulesResult;
}

export type TImapConfig = {
  imap: {
    user: string,
    password: string,
    host: string,
    port: number,
    tls: boolean,
    authTimeout: number
  }
}

export type TMain = {
  dataDir: string,
  attachmentsFileName: string,
  rulesFileName: string
}

export type TImap = {
  imapConfig: TImapConfig,
  connection?: ImapSimple,
}

export type TAttachmentInfoMap = { [key: string]: TAttachmenInfo };

export type THistory = {
  storedAttachmentsInfo?: TAttachmentInfoMap
}

export type TPrintPreProcessor = {
  processed: TAttachmentInfoMap
}

export type TData = {
  main: TMain,
  imap: TImap,
  printRules?: TPrintRules,
  printPreProcessor: TPrintPreProcessor,
  history: THistory
};
