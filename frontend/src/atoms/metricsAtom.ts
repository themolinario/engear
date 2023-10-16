import { atom } from "jotai";
import { IMetrics } from "../types/Metrics.ts";


export const metricsAtom = atom<IMetrics>({
  ip: "N.N.",
  userAgent: "N.N.",
  streamedTime: "N.N.",
  rebufferingEvents: "N.N.",
  rebufferingTime: "N.N.",
  speedTest: "N.N."
})