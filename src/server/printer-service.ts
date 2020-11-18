import { TPrintPreProcessor, TAttachmenInfo, TPrintData, TPrintResult } from '../common/types'
import { Printer } from "ipp";
import _ from 'lodash';

const printFile = (dataBase64: Buffer, pagesRanges: string) => new Promise((resolve, reject) => {
  const printer = new Printer("http://localhost:631/printers/Brother_DCP_7030_X");
  const msg = {
    "operation-attributes-tag": {
      "document-format": "application/pdf"
    },
    "page-ranges": pagesRanges,
    "data": dataBase64
  };
  console.log('msg', msg);
  printer.execute("Print-Job", msg, (err: any, res: any) => {
    if (err) {
      console.log('err', err);
      return reject(err);
    }
    resolve(res);
  });
});

export async function* print<T extends TPrintData>(printData: Array<T>): AsyncGenerator<T & TPrintData & TPrintResult>{
  for (const data of printData) {
    try {
      if (data.status !== 'TO_PRINT' || !data.pagesRanges) {
        yield data
        continue;
      }
      const result = await printFile(data.pdfBase64, data.pagesRanges)
      yield {
        ...data,
        status: 'PRINTED',
        printResult: result
      }
      return;
    } catch (e) {
      yield {
        ...data,
        status: 'PRINT_ERROR',
        printResult: e.toString()
      }
    }
  }
  console.log('Done.')
}
