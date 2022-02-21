import {postRequest} from "../api/index.network";
import {changeDateToUserTimezone} from "../utils/CustomDate";

export async function getUserReviews(authId: string) {
    let body = JSON.stringify({authId: authId})
    return changeDateToUserTimezone(await postRequest('/api/review/getAuthorReviews', body))
}

