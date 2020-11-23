import fs from "fs";
import { TAttachmentInfo, TMain, THistory, TAttachmentInfoMap } from '../common/types'
import path from "path";
import _ from "lodash"
import { write } from './hist-service';

export const getJsonDir = (main: TMain) => path.join(main.dataDir, main.attachmentsFileName)
export const getPrevAttachmentInfo = (processedAttachments: TAttachmentInfoMap, messageId: string) => processedAttachments?.[messageId]

export const readProcessedMessages = (main: TMain, history: THistory) => new Promise<TAttachmentInfoMap>((resolve, reject) => {
  const pathToFile = getJsonDir(main)
  if (history.storedAttachmentsInfo) {
    return resolve(history.storedAttachmentsInfo);
  }
  if (!fs.existsSync(pathToFile)) {
    return resolve({});
  }
  fs.readFile(pathToFile, (err, res) => {
    if (err) return reject(err);
    const jsonData: TAttachmentInfo[] = JSON.parse(res.toString());
    resolve(_.keyBy(jsonData, 'messageId'));
  });
});

export const writeProcessedMessages = async (main: TMain, processedAttachments: TAttachmentInfo[]) => {
  const pathToFile = getJsonDir(main)
  await write(pathToFile, JSON.stringify(_.values(processedAttachments)))
};
