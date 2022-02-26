import {postRequest} from "../api/index.network";
import {changeDateToUserTimezone} from "../utils/CustomDate";

export async function getUserReviews(authId: string) {
    let body = JSON.stringify({authId: authId})
    return changeDateToUserTimezone(await postRequest('/api/review/getAuthorReviews', body))
}

export async function saveEditedReview(authId: string, review:Object) {
    let body = JSON.stringify({authId: authId, review:review})
    return changeDateToUserTimezone(await postRequest('/api/review/edit', body))
}

export async function saveNewReview(authId: string, review:Object) {
    let body = JSON.stringify({authId: authId, review:review})
    return changeDateToUserTimezone(await postRequest('/api/review/create', body))
}