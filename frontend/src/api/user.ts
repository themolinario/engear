import axios from "axios";

const baseURL = "http://localhost:80/api";
const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };

export function updateStreamedTimeByUser(playedSeconds: number) {
  return axios.put(`users/streamedTimeTotal`, { playedSeconds: playedSeconds }, { baseURL, headers });
}

export function getCurrentUser() {
  return axios.get(`users/currentUser`, { baseURL, headers });
}

export function updateRebufferingEvents() {
  return axios.put(`users/rebufferingEvents`, {}, { baseURL, headers });
}

export function updateRebufferingTime(rebufferingTime: number) {
  return axios.put(`users/updateRebufferingTime`, { rebufferingTime }, { baseURL, headers });
}
