import axios from "axios";
import { IUser } from "../types/User.ts";

export function updateStreamedTimeByUser(playedSeconds: number) {
  return axios.put<IUser>(`users/streamedTimeTotal`, { playedSeconds: playedSeconds });
}

export function getCurrentUser() {
  return axios.get(`users/currentUser`);
}

export function updateRebufferingEvents() {
  return axios.put(`users/rebufferingEvents`);
}

export function updateRebufferingTime(rebufferingTime: number) {
  return axios.put(`users/rebufferingTime`, { rebufferingTime });
}

export function getSpeedTest() {
  return axios.get(`users/speedTest`);
}