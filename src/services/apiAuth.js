import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function signUp(body) {
    return axios.post(`${BASE_URL}/signup`, body);
}
function signIn(body) {
    return axios.post(`${BASE_URL}/signin`, body);
}
function logout(token) {
    return axios.post(`${BASE_URL}/logout`, {}, { headers: { Authorization: token} });
}

const apiAuth = { signUp, signIn, logout };

export default apiAuth;