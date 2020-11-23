import { Printer } from "ipp";
import _ from 'lodash';

export const printFile = (dataBase64: Buffer, pagesRanges: string) => new Promise<string>((resolve, reject) => {
  const printer = new Printer("http://localhost:631/printers/Brother_DCP_7030_X");
  const msg = {
    "operation-attributes-tag": {
      "document-format": "application/pdf"
    },
    "page-ranges": pagesRanges,
    "data": dataBase64
  };
  printer.execute("Print-Job", msg, (err: any, res: any) => {
    if (err) {
      console.log('err', err);
      return reject(err.toString());
    }
    resolve(res.toString());
  });
});
