import fs from "fs";
import { TAttachmenInfo, TMain, THistory, TAttachmentInfoMap } from '../common/types'
import path from "path";
import _ from "lodash"

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
    const jsonData: TAttachmenInfo[] = JSON.parse(res.toString());
    resolve(_.keyBy(jsonData, 'messageId'));
  });
});

export const writeProcessedMessages = (main: TMain, processedAttachments: TAttachmenInfo[]) => new Promise<THistory["storedAttachmentsInfo"]>((resolve, reject) => {
  const pathToFile = getJsonDir(main)
  const processedAttachmentsMap = _.keyBy(processedAttachments, 'messageId')
  fs.writeFile(pathToFile, JSON.stringify(_.values(processedAttachments)), (err) => {
    if (err) return reject(err);
    resolve(processedAttachmentsMap);
  });

});
