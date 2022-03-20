import { rawPostRequest } from '../index.network';

export async function changeReviewLikeState(authId, reviewId) {
  const body = JSON.stringify({ authId, reviewId });
  return await rawPostRequest('/api/rating/changeReviewLikeState', body);
}

export async function changeReviewUsersContentScore(authId, reviewId, contentScore) {
  const body = JSON.stringify({ authId, reviewId, contentScore });
  return await rawPostRequest('/api/rating/changeReviewUsersContentScore', body);
}
