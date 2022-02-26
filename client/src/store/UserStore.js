import {postRequest, postSecretRequest} from "../api/index.network";

export async function registerNewUser(token: string, authId: string, name: string) {
    let body = JSON.stringify({authId: authId, name: name})
    return await postSecretRequest(token, '/api/user/registration', body)
}

export async function getUserById(id: number) {
    let body = JSON.stringify({id: id})
    return await postRequest('/api/user/getUserById', body)
}

export async function getUserByAuthId(token: string, authId: string) {
    let body = JSON.stringify({authId: authId})
    return await postSecretRequest(token, '/api/user/getUser', body)
}