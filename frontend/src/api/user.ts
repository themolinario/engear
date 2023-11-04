import axios from "axios";
import { IUser } from "../types/User.ts";

const baseURL = "http://localhost:80/api";

export function updateStreamedTimeByUser(playedSeconds: number) {
  const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };
  return axios.put<IUser>(`users/streamedTimeTotal`, { playedSeconds: playedSeconds }, { baseURL, headers });
}

export function updateStreamedData(streamedData: number) {
  const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };
  return axios.put<IUser>(`users/streamedData`, { streamedData: streamedData }, { baseURL, headers });
}

export function getCurrentUser() {
  const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };
  return axios.get(`users/currentUser`, { baseURL, headers });
}

export function updateRebufferingEvents() {
  const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };
  return axios.put(`users/rebufferingEvents`, {}, { baseURL, headers });
}

export function updateRebufferingTime(rebufferingTime: number) {
  const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };
  return axios.put(`users/rebufferingTime`, { rebufferingTime }, { baseURL, headers });
}

export function getSpeedTest() {
  return axios.get(`users/speedTest`, {baseURL})
}
