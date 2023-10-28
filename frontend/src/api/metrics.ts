import axios from "axios";
import { IIpAddress, IMetrics, IUserAgent } from "../types/Metrics";

const baseURL = "http://localhost:80/api";
const headers = { Authorization: `Bearer ${window.sessionStorage.getItem("token")}` };

export function getIPAddres () {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios.get<IIpAddress>('https://api.ipify.org?format=json', )
}

export function getUserAgent () {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios.get<IUserAgent>("https://api.ipgeolocation.io/user-agent?apiKey=f9292396856c40c994548c93a93fbe07")
}

export function postMetrics (metrics: Omit<IMetrics, "ip">) {
    return axios.post<IMetrics>("metrics" , metrics, {baseURL, headers})
}

export function getAllMetrics () {
    return axios.get<IMetrics[]>("metrics/general", {baseURL, headers})
}