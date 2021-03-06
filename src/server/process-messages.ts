import fs from "fs";
import { google, gmail_v1 } from "googleapis";
import _ from "lodash";
import moment from "moment";
import path from "path";
import { Printer } from "ipp";
import { TAttachmentInfo } from "../common"
import { getGmailApi } from './gmail'

const dataDir = "./data/";
const attachmentsFileName = "processed-messages.json";

export const getTo = (message: gmail_v1.Schema$Message) => {
  const payload = message.payload;
  const headers = payload && payload.headers;
  const subjectHeader = _.filter(headers, { name: "To" }).map(o => o.value);
  return subjectHeader.join(",");
};

export const getFrom = (message: gmail_v1.Schema$Message) => {
  const payload = message.payload;
  const headers = payload && payload.headers;
  const subjectHeader = _.find(headers, { name: "From" });
  return subjectHeader && subjectHeader.value;
};


export const getSubject = (message: gmail_v1.Schema$Message) => {
  const payload = message.payload;
  const headers = payload && payload.headers;
  const subjectHeader = _.find(headers, { name: "Subject" });
  return subjectHeader && subjectHeader.value;
};

export const getSentDateMmtUtc = (message: gmail_v1.Schema$Message) => {
  const payload = message.payload;
  const headers = payload && payload.headers;
  const subjectHeader = _.find(headers, { name: "Date" });
  return subjectHeader && subjectHeader.value;
};

export const findPdfPart = (message: gmail_v1.Schema$Message) => {
  const payload = message.payload;
  const parts = payload && payload.parts;
  return _.find(parts, part => !!part.filename && part.filename.includes(".pdf"));
};

export const getPagesRanges = (subject: string, fileName: string, from: string, to: string) => {
  if (!fileName.toLocaleLowerCase().includes("faktura")) return {
    pagesRanges: null,
    reason: "SUBJECT NOT: faktura"
  };
  if (to.toLocaleLowerCase().includes("infolet.pl")) return {
    pagesRanges: null,
    reason: "TO: infolet.pl"
  };
  return {
    pagesRanges: "1",
    reason: null
  };
};

const cfg = {
  debug: true,
  print: false
};

export const log = (prefix: string, attachmentInfo: TAttachmentInfo) => {
  if (cfg.debug) {
    console.log(prefix,
      attachmentInfo.timeStamp,
      attachmentInfo.pagesRanges,
      attachmentInfo.reason,
      attachmentInfo.sentDateMmtUtc,
      attachmentInfo.from
    );
  }
};

export const handleMessage = async (processedMessages: { [attachmentId: string]: TAttachmentInfo }, msgId: string): Promise<TAttachmentInfo | null> => {
  const gmailApi = await getGmailApi();
  const messageResponse = await gmailApi.users.messages.get({
    id: msgId,
    userId: "me",
  });
  const message = messageResponse.data;
  const subject = getSubject(message);
  const from = getFrom(message);
  const to = getTo(message);
  const sentDateMmtUtc = getSentDateMmtUtc(message);
  const pdfPart = findPdfPart(message);
  const fileName = pdfPart && pdfPart.filename;
  const attachmentId = pdfPart && pdfPart.body && pdfPart.body.attachmentId;
  if (!subject || !fileName || !attachmentId || !sentDateMmtUtc || !from || !to) {
    return null;
  }
  const processedMessage = processedMessages[msgId];
  if (processedMessage) {
    log("ALREADY PROCESSED", processedMessage);
    return processedMessage;
  }
  const pagesRanges = getPagesRanges(subject, fileName, from, to);
  const inProgessAttachment: TAttachmentInfo = {
    timeStamp: moment().format(),
    pagesRanges: pagesRanges.pagesRanges,
    reason: pagesRanges.reason,
    sentDateMmtUtc: sentDateMmtUtc,
    from: from,
    subject: subject,
    fileName: fileName,
    messageId: msgId,
  };
  if (!pagesRanges.pagesRanges) {
    log("NOT PRINTING", inProgessAttachment);
    return inProgessAttachment;
  }
  const attResponse = await gmailApi.users.messages.attachments.get({
    id: attachmentId,
    messageId: msgId,
    userId: "me"
  });
  const dataBase64 = attResponse.data.data;
  if (!dataBase64) {
    const errorAttachmentInfo = {
      ...inProgessAttachment,
      pagesRanges: null,
      reason: `ERROR(no data in attachment part)`
    };
    log("ERROR", errorAttachmentInfo);
    return errorAttachmentInfo;
  }
  if (cfg.print) {
    try {
      await printFile(Buffer.from(dataBase64, "base64"), pagesRanges.pagesRanges);
    } catch (e) {
      log("ERROR-PRINTED: " + e, inProgessAttachment);
      return null;
    }
    log("PRINTED", inProgessAttachment);
  } else {
    log("DRY-PRINTED", inProgessAttachment);
  }
  return inProgessAttachment;
};

export const readProcessedMessages = () => new Promise<TAttachmentInfo[]>((resolve, reject) => {
  const pathToFile = path.join(dataDir, attachmentsFileName);
  if (!fs.existsSync(pathToFile)) {
    return resolve([]);
  }
  return fs.readFile(pathToFile, (err, res) => {
    if (err) return reject(err);
    resolve(JSON.parse(res.toString()));
  });
});

export const writeProcessedMessages = (processedAttachments: TAttachmentInfo[]) => new Promise((resolve, reject) => {
  fs.writeFile(path.join(dataDir, attachmentsFileName), JSON.stringify(processedAttachments), (err) => {
    if (err) return reject(err);
    resolve();
  });
});

const printFile = (dataBase64: Buffer, pagesRanges: string) => new Promise((resolve, reject) => {
  const printer = new Printer("http://192.168.2.2:631/printers/Brother_DCP-7030");
  const msg = {
    "operation-attributes-tag": {
      "document-format": "application/pdf",
    },
    "page-ranges": pagesRanges,
    "data": dataBase64
  };
  printer.execute("Print-Job", msg, (err: any, res: any) => {
    if (err) {
      return reject(err);
    }
    resolve(res);
  });
});

export const processMessages = async () => {
  const gmailApi = await getGmailApi();
  const messagesResponse = await gmailApi.users.messages.list({
    userId: "me",
  });

  const processAttachmentJson = await readProcessedMessages();
  const messageId: keyof TAttachmentInfo = "messageId";
  const processedAttachments = _.keyBy<TAttachmentInfo>(processAttachmentJson, messageId);

  const attachmentInfoPromisesArray: Array<Promise<TAttachmentInfo | null>> = _.map(messagesResponse.data.messages, message => {
    if (!message.id) {
      return Promise.resolve(null);
    }
    return handleMessage(processedAttachments, message.id);
  });

  const attachmentInfoArray: Array<TAttachmentInfo | null> = await Promise.all(attachmentInfoPromisesArray);
  const newProcessedMessages: TAttachmentInfo[] = _.compact(attachmentInfoArray);

  await writeProcessedMessages(newProcessedMessages);

  return newProcessedMessages;
};
