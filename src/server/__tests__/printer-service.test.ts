import { print } from '../main'
import _ from 'lodash';
import { TAttachmentInfo } from '../../common/types'

jest.mock('../print-service', () => {
  const times = [3000, 2000, 1000]
  let counter = 0;
  return {
    printFile: async () => {
      const time = times[counter];
      counter = (counter + 1) % 3;
      await new Promise((result) => setTimeout(result, time));
      return "Test PRINTED OK";
    }
  }
});

jest.mock('../hist-service', () => {
  return {
    write: async (pathToFile: string, text: string) => {
      // console.log("path", pathToFile)
      // console.log("text", text)
    }
  }
});


describe.only("printer-service", () => {

  const printData: Array<TAttachmentInfo> = [{
    messageId: '123',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  }, {
    messageId: '456',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  },
  {
    messageId: '789',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  }]

  it.only("should work", async () => {
    const results = await print(printData);
    // console.log(results);
  })
})
