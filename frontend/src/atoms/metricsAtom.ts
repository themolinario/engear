import { atom } from "jotai";
import { IMetricUser } from "../types/Metrics.ts";

export const metricUserAtom = atom<IMetricUser>({
  streamedTimeTotal: 0,
  rebufferingEvents: "N.N.",
  rebufferingTime: 0
});