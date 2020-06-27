import { getPrintRules, printEmails, getHistoryProcessedMessages, print, data } from '../main'
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

// jest.mock('../../common/', () => {
//   return {
//     PRINTED_EMAILS_ENDPOINT_PATH: 'OK'
//   }
// });

describe("Test", () => {

  it('should be', async () => {
    const messsages = await printEmails();
    console.log('Result', messsages)

    expect(messsages).toBeTruthy()
  });

  it('get print rules', () => {
    //given
    const attachmentInfo = {
      messageId: "123",
      timeStamp: "20200201T1230",
      from: 'info@abc.com',
      to: 'ela167@wp.pl',
      subject: 'faktura. go',
      fileName: 'file.pdf',
      pdfBase64: 'abc'
    }

    //when
    const decision = getPrintRules().getPagesRanges(attachmentInfo)

    //then
    expect(decision).toEqual({
      pagesRanges: "1",
      reason: null
    })
  })

  it('get history processed messages', async () => {
    //when
    const attachmentInfo = await getHistoryProcessedMessages();

    //then
    expect(_.size(attachmentInfo)).toBeGreaterThan(0)
    // expect(attachmentInfo).toEqual({})
  })

  it('print emails', async () => {
    const a = await printEmails();
    const x = _.filter(a, x => x.pdfBase64)

    console.log('x', x)
  }, 30000)

  it.only('print', async () => {

    const pdf = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path.join(__dirname, './temp_txt.pdf'), (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      });
    });

    data.printPreProcessor.processed = {
      a: {
        messageId: 'a',
        timeStamp: '123',
        pagesRanges: '1',
        reason: null,
        status: "PRINTING",
        sentDateMmtUtc: '20200201T1230',
        from: 'stan@stan.pl',
        to: 'stan@stan.pl',
        subject: 'faktura',
        fileName: 'test.pdf',
        pdfBase64: pdf
      }
    }
    await print()
  }, 30000)


});
