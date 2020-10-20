import { getGmailApi } from '../gmail'

jest.mock('../../common/', () => {
  return {
    PRINTED_EMAILS_ENDPOINT_PATH: 'OK'
  }
});

describe("Test", () => {
  it.only('should be', () => {
    expect(true).toBe(true)
  });
  it('should be 1', () => {
    expect(true).toBe(false)
  });
});
