import { TPrintData, TPrintResult, TPrintResultCb } from '../common/types'
import { printFile } from './print-service'
import _ from 'lodash';


export async function print<T extends TPrintData>(printData: Array<T>, callback: TPrintResultCb): Promise<Array<T & TPrintResult>> {
  const results = _.map(printData, async (dataToPrint) => {
    try {
      if (dataToPrint.status !== 'TO_PRINT' || !dataToPrint.pagesRanges) {
        callback(dataToPrint);
        return dataToPrint;
      }
      const printResult = await printFile(dataToPrint.pdfBase64, dataToPrint.pagesRanges)
      const dataToPrintSucc = {
        ...dataToPrint,
        status: 'PRINTED',
        printResult: printResult
      };
      callback(dataToPrintSucc)
      return dataToPrintSucc;
    } catch (e) {
      const dataToPrintErr = {
        ...dataToPrint,
        status: 'PRINT_ERROR',
        printResult: e.toString()
      };
      callback(dataToPrintErr)
      return dataToPrintErr
    }
  })
  const printedData = await Promise.all(results);
  return printedData;
}
