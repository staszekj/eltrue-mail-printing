import { TPrintPreProcessor } from '../common/types'
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

export const print = async (printerPreProcessor: TPrintPreProcessor) => {
  await Promise.all(_.map(printerPreProcessor.processed, async (val) => {
    try {
      await printFile(val.pdfBase64, val.pagesRanges);
      console.log('OK !!!')
      return val;
    } catch (e) {
      console.log("ERROR-PRINTED: " + e);
      return val;
    }
  }));
  console.log('Done.')
}
