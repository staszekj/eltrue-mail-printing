import { getGmailApi, aaa } from '../gmail'

jest.mock('../../common/', () => {
  return {
    PRINTED_EMAILS_ENDPOINT_PATH: 'OK'
  }
});

describe("Test", () => {
  it.only('should be', async() => {
    const api = await getGmailApi();
    expect(api).toBe(api)
  });
  it('should be 1', () => {
    expect(true).toBe(false)
  });
});
