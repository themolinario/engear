import {NavigateFunction} from "react-router-dom";
import axios from "axios";

export function logout ({navigate} : {navigate: NavigateFunction}) {
    delete axios.defaults.headers.common.Authorization;
    sessionStorage.removeItem('token');
    navigate("/login");
}