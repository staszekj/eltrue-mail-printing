export type TPrintStatus = 'PRINTING'

export type TAttachmenInfo = {
  messageId: string,
  timeStamp?: string;
  pagesRanges?: string | null;
  status?: TPrintStatus;
  sentDateMmtUtc?: string;
  from?: string;
  subject?: string,
  fileName?: string,
  pdfBase64?: string
}
