import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function signUp(body) {
    return axios.post(`${BASE_URL}/signup`, body);
}

const apiAuth = { signUp };

export default apiAuth;