import axios from "axios";
import {IIpAddress, IUserAgent} from "../types/Metrics";

export function getIPAddres () {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios.get<IIpAddress>('https://api.ipify.org?format=json', )
}

export function getUserAgent () {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios.get<IUserAgent>("https://api.ipgeolocation.io/user-agent?apiKey=f9292396856c40c994548c93a93fbe07")
}