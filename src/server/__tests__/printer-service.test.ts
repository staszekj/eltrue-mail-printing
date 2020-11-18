import { print } from '../printer-service'
import { TPrintData } from '../../common/types'
import _ from 'lodash';

describe.only("printer-service", () => {

  const printData: Array<TPrintData> = [{
    messageId: '123',
    status: 'TO_PRINT',
    pagesRanges: '123',
    pdfBase64: Buffer.from("123")
  }]

  it.only("should work", async () => {
    const datas = []
    for await (const data of print(printData)) {
      datas.push(data);
    }
    console.log(datas)
  })
})
