import { getAttachmentsToProcess } from './imap'
import { TAttachmenInfo } from '../common/types'
import _ from 'lodash'

export const processEmails = async () => {
  const attachmentsToProcess = await getAttachmentsToProcess();
  const toPrint = _.chain(attachmentsToProcess)
    .map((attachment: TAttachmenInfo) => {
      return {
        ...attachment,
        status: 'PRINTING',
      }
    })
    .map((attachment: TAttachmenInfo) => {
      return {
        ...attachment,
        pagesRanges: '1-2'
      }
    })
    .value();
  console.log(toPrint)
}
