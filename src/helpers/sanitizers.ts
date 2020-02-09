import { STRIP_KEY_PARTS } from "../models";

export function stripRegionNameForKey(region: string | null): string {
  if (!region) { return ""; }
  return STRIP_KEY_PARTS.reduce((acc: string, v) => { return acc.replace(v, "") }, region || "");
}
