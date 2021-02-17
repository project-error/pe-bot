import {parseDateFromStr} from "./miscUtils";
import {Dayjs} from "dayjs";

export const resolveTime = (str: string): Dayjs | null | 'perma' => {
  const input = str.toLowerCase()
  if (input === 'perma') return 'perma'
  if (!input) return null
  const matches = input.match(/(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)([dhmy])/)
  if (!matches) return null
  return parseDateFromStr(matches[0])
}