import {postRequest, postSecretRequest, rawPostRequest} from "../index.network";

export async function registerNewUser(token, authId, name, picture) {
    let body = JSON.stringify({authId: authId, name: name, picture: picture})
    return await postSecretRequest(token, '/api/user/registration', body)
}

export async function changeUserName(authId, newUserName) {
    let body = JSON.stringify({authId, newUserName})
    return await rawPostRequest('/api/user/changeName', body)
}

export async function getUserById(id) {
    let body = JSON.stringify({id: id})
    return await postRequest('/api/user/getUserById', body)
}

export async function getUserByAuthId(token, authId) {
    let body = JSON.stringify({authId: authId})
    return await postSecretRequest(token, '/api/user/getUser', body)
}