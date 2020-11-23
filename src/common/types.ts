import { ImapSimple } from 'imap-simple'

export type TPrintStatus = 'DOWNLOADING' | 'TO_PRINT' | 'PRINTED' | 'PRINT_ERROR'

export type TAttachmentInfo = {
  messageId: string,
  timeStamp?: string;
  status?: TPrintStatus;
  sentDateMmtUtc?: string;
  from?: string;
  to?: string;
  subject?: string,
  fileName?: string,
  pagesRanges?: string,
  pdfBase64?: Buffer,
  printResult?: string,
  printDateMntUtc?: string
}

export type TPrintResultCb = (result: TAttachmentInfo) => void;

export type TPrintRulesResult = {
  pagesRanges?: string,
  reason?: string
}

export type TPrintRules = {
  getPagesRanges: (info: TAttachmentInfo) => TPrintRulesResult;
}

export type TImapCfg = {
  user: string,
  password: string,
  host: string,
  port: number,
  tls: boolean,
  authTimeout: number,
}

export type TImapMap = {
  [key: string]: TImapCfg
}


export type TImapConfig = {
  imap: TImapMap
}

export type TMain = {
  dataDir: string,
  attachmentsFileName: string,
  rulesFileName: string
}


export type TAttachmentInfoMap = { [key: string]: TAttachmentInfo };

export type THistory = {
  storedAttachmentsInfo?: TAttachmentInfoMap
}

export type TPrintPreProcessor = {
  processed: TAttachmentInfoMap
}

export type TData = {
  main: TMain,
  imapConfig: TImapConfig,
};
