import { TAttachmentInfo, TPrintResultCb, TMain } from '../common/types'
import { printFile } from './print-service'
import _ from 'lodash';


export async function print(printData: Array<TAttachmentInfo>, callback?: TPrintResultCb): Promise<Array<TAttachmentInfo>> {
  const results = _.map(printData, async (dataToPrint) => {
    try {
      if (dataToPrint.status !== 'TO_PRINT' || !dataToPrint.pagesRanges || !dataToPrint.pdfBase64) {
        callback?.(dataToPrint);
        return dataToPrint;
      }
      const printResult = await printFile(dataToPrint.pdfBase64, dataToPrint.pagesRanges)
      const dataToPrintSucc: TAttachmentInfo = {
        ...dataToPrint,
        status: 'PRINTED',
        printResult: printResult
      };
      callback?.(dataToPrintSucc)
      return dataToPrintSucc;
    } catch (e) {
      const dataToPrintErr: TAttachmentInfo = {
        ...dataToPrint,
        status: 'PRINT_ERROR',
        printResult: e
      };
      callback?.(dataToPrintErr)
      return dataToPrintErr
    }
  })
  return await Promise.all(results);
}
