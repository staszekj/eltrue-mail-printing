import { getGmailApi } from '../gmail'


// jest.mock('../../common/', () => {
//   return {
//     PRINTED_EMAILS_ENDPOINT_PATH: 'OK'
//   }
// });

describe("Test", () => {

  it.only('should be', async() => {
    const gmailApi = await getGmailApi();

    const messagesResponse = await gmailApi.users.messages.list({
      userId: "me",
    });

    expect(messagesResponse).toBeTruthy()
  });

  it('should be 1', () => {
    expect(true).toBe(false)
  });
});
