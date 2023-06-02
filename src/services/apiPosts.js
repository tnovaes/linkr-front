import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function getTimeline(token) {
    return axios.get(`${BASE_URL}/posts`, { headers: { Authorization: token } });
}

const apiPosts = { getTimeline };

export default apiPosts;