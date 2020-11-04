import { processEmails } from '../process-emails'


describe.only("Process Emails", () => {
  it.only('should run',  async () => {
    await processEmails();
  }, 20000);

});
