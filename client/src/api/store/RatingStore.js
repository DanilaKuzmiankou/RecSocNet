import {postRequest, rawPostRequest} from "../index.network";

export async function changeReviewLikeState(authId, reviewId){
    const body = JSON.stringify({authId, reviewId})
    return await rawPostRequest('/api/rating/changeReviewLikeState', body)
}
