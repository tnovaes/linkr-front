import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function signUp(body) {
    return axios.post(`${BASE_URL}/signup`, body);
}
function signIn(body) {
    return axios.post(`${BASE_URL}/signin`, body);
}
function logout(token) {
    return axios.post(`${BASE_URL}/logout`, {}, { headers: { Authorization: token } });
}
function getUsers(token, searchText) {
    return axios.post(`${BASE_URL}/users`, { searchText }, { headers: { Authorization: token } });
}
function getUserProfilePhoto(token) {
    return axios.get(`${BASE_URL}/users/profilePhotoUrl`, { headers: { Authorization: token } });
}
function getUserPhoto(token, id) {
    return axios.get(`${BASE_URL}/users/${id}/profilePhotoUrl`, { headers: { Authorization: token } });
}
function setFollower(token, id, isFollowed) {
    return axios.post(`${BASE_URL}/users/${id}/follow`, { isFollowed }, { headers: { Authorization: token } });
}
function getIsFollowing(token, id) {
    return axios.get(`${BASE_URL}/users/${id}/following`, { headers: { Authorization: token } });
}

const apiAuth = { signUp, signIn, logout, getUsers, getUserPhoto, getUserProfilePhoto, setFollower, getIsFollowing };

export default apiAuth;