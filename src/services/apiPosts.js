import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function getTimeline(token) {
    return axios.get(`${BASE_URL}/posts`, { headers: { Authorization: token } });
}

function publishPost(body, token) {
    return axios.post(`${BASE_URL}/post`, body, { headers: { Authorization: token } });
}

function getPostsByUserID(token, id) {
    return axios.get(`${BASE_URL}/posts/users/${id}`, { headers: { Authorization: token } });
}

function deletePostByID(token, id) {
    return axios.delete(`${BASE_URL}/post/${id}`, { headers: { Authorization: token } });
}

function getPostsByHashtag(token, name) {
    return axios.get(`${BASE_URL}/posts/hashtag/${name}`, { headers: { Authorization: token } });
}

function postEdit(token, body, id) {
    return axios.put(`${BASE_URL}/post/${id}`, body, { headers: { Authorization: token } })
}

function getLikes(token) {
    return axios.get(`${BASE_URL}/users/likes`, { headers: { Authorization: token } })
}
function toggleLike(token, post_id) {
    return axios.post(`${BASE_URL}/likes/${post_id}`, {}, { headers: { Authorization: token } })
}


function getPostsLikesInfo(token, post_id) {
    return axios.get(`${BASE_URL}/likes/${post_id}`, { headers: { Authorization: token } })
}

function postComment(token,body,post_id){
    return axios.post(`${BASE_URL}/comment/${post_id}`, body, { headers: { Authorization: token } })
}


const apiPosts = { getTimeline, publishPost, getPostsByUserID, deletePostByID, getPostsByHashtag, postEdit, getLikes, toggleLike, getPostsLikesInfo, postComment};

export default apiPosts;