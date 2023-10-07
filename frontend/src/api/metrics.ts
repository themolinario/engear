import axios from "axios";
import {IIpAddress} from "../types/Metrics";

export function getIPAddres () {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios.get<IIpAddress>('https://api.ipify.org?format=json', )
}