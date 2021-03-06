import { TMain, TPrintRules } from '../common/types'
import path from "path";
import _ from "lodash"

export const getRulesFileName = (main: TMain) => path.join(process.cwd(), main.dataDir, main.rulesFileName)

export const getPrintRules = (main: TMain) => {
  return require(getRulesFileName(main)) as TPrintRules
}
