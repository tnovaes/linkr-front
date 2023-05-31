import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function signUp(body) {
    return axios.post(`${BASE_URL}/signup`, body);
}
function signIn(body) {
    return axios.post(`${BASE_URL}/signin`, body);
}

const apiAuth = { signUp, signIn };

export default apiAuth;