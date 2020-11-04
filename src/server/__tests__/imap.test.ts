import { getMessages } from '../imap'


// jest.mock('../../common/', () => {
//   return {
//     PRINTED_EMAILS_ENDPOINT_PATH: 'OK'
//   }
// });

xdescribe("Test", () => {

  it('should be', async () => {
    const messsages = await getMessages();
    console.log('Messages', messsages)

    expect(messsages).toBeTruthy()
  });

  it('should be 1', () => {
    expect(true).toBe(false)
  });
});
