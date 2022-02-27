import {postRequest} from "../api/index.network";
import {changeDateToUserTimezone} from "../utils/CustomDate";

export async function getUserReviews(authId: string) {
    let body = JSON.stringify({authId: authId})
    return await postRequest('/api/review/getAuthorReviews', body)
}

export async function saveEditedReview(authId: string, review:Object) {
    let body = JSON.stringify({authId: authId, review:review})
    return await postRequest('/api/review/edit', body)
}

export async function saveNewReview(authId: string, review:Object) {
    let body = JSON.stringify({authId: authId, review:review})
    return await postRequest('/api/review/create', body)
}

export async function deleteUserReview(authId: string, id:number) {
    let body = JSON.stringify({authId: authId, id:id})
    return await postRequest('/api/review/delete', body)
}