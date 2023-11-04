import {IUser} from "../types/User.ts";
import axios from "axios";

const baseURL = "http://localhost:80/api";
export function signIn (name: string, password: string) {
    return axios.post<{token: string, user: IUser}>("auth/signin", { name, password }, {baseURL: baseURL});
}

export function signUp (name: string, email: string, password: string) {
    return axios.post<IUser>("auth/signup", {name, email, password}, { baseURL })
}