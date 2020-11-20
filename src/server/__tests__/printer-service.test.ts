import { print } from '../printer-service'
import { TPrintData } from '../../common/types'
import _ from 'lodash';

jest.mock('../print-service', () => {
  return {
    printFile: async () => {
      await new Promise((result) => setTimeout(result, 2000));
      return "Test PRINTED OK";
    }
  }
});


describe.only("printer-service", () => {

  const printData: Array<TPrintData> = [{
    messageId: '123',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  }, {
    messageId: '123',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  }]

  it.only("should work", async () => {
    const results = await print(printData, (data) => console.log(data));
    console.log(results);
  })
})
