import { atom } from "jotai";
import { IUser } from "../types/User.ts";

export const userAtom = atom<IUser>({
  _id: "",
  email: "",
  name: "",
  password: "",
  roles: [],
  subscribedUsers: [],
  subscribers: 0,
  totalStreamedTime: 0
})