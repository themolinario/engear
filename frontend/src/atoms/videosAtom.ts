import {atom} from "jotai";
import {IVideo} from "../types/Video.ts";

export const videosAtom= atom<IVideo[]>([]);