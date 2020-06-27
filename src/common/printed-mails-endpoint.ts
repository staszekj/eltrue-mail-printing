export interface TAttachmentInfo {
  timeStamp: string;
  pagesRanges: string | null;
  reason: string | null;
  sentDateMmtUtc: string;
  from: string;
  subject: string,
  fileName: string,
  messageId: string,
}


export type TPrintedMailsResponse = Array<TAttachmentInfo>;
