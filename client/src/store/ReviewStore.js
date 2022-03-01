import {postRequest, postRequestToCloudinary} from "../api/index.network";
import {changeDateToUserTimezone} from "../utils/CustomDate";
import firebase from "../utils/Firebase";

export async function getUserReviews(authId: string) {
    let body = JSON.stringify({authId: authId})
    return await postRequest('/api/review/getAuthorReviews', body)
}

export async function saveEditedReview(authId: string, review: Object) {
    let body = JSON.stringify({authId: authId, review: review})
    return await postRequest('/api/review/edit', body)
}

export async function saveNewReview(authId: string, review: Object) {
    let body = JSON.stringify({authId: authId, review: review})
    return await postRequest('/api/review/create', body)
}

export async function deleteUserReview(authId: string, id: number) {
    let body = JSON.stringify({authId: authId, id: id})
    return await postRequest('/api/review/delete', body)
}

export async function deleteReviewImage(imageId: string) {
    const body = new FormData();
    body.append("public_id", imageId);
    return await postRequestToCloudinary('/destroy', body)
}


export async function uploadImagesToFirebaseCloud(images: Array) {
    let imagesUrl = []
    let file
    let fileRef
    let downloadUrl
    let uploadTaskSnapshot
    const storageRef = firebase.storage().ref()
    for (let i = 0; i < images.length; i++) {
        file = images[i]
        try {
            fileRef = storageRef.child('reviews_images/' + file.name)
            uploadTaskSnapshot = await fileRef.put(file);
            downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL()
            imagesUrl[i] = downloadUrl
        } catch (error) {
            console.log("ERR ===", error);
            alert("Image uploading failed!");
        }
    }
    return imagesUrl
}