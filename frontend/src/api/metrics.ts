import axios from "axios";
import { IIpAddress, IMetricUser, IUserAgent } from "../types/Metrics";

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

export function postMetrics (metrics: IMetricUser) {
    return axios.post<IMetricUser>("metrics" , metrics, {baseURL, headers})
}

export function getAllMetrics () {
    return axios.get<IMetricUser[]>("metrics/general", {baseURL, headers})
}