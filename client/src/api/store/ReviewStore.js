import {getRequest, postRequest} from "../index.network";
import {changeDateToUserTimezone, generateRandomString} from "../../utils/Utils";
import firebase from "../../utils/Firebase";
import {forEach} from "react-bootstrap/ElementChildren";

export async function getUserReviews(authId, userId) {
    let body = JSON.stringify({authId: authId, userId:userId})
    return await postRequest('/api/review/getAuthorReviews', body)
}


export async function getNewestReviews(limit, offset, userId) {
    let body = JSON.stringify({limit, offset, userId})
    return await postRequest('/api/review/newestReviews', body)
}

export async function saveEditedReview(review) {
    let body = JSON.stringify({review: review})
    return await postRequest('/api/review/edit', body)
}

export async function saveNewReview(authId, review) {
    let body = JSON.stringify({authId: authId, review: review})
    return await postRequest('/api/review/create', body)
}

export async function deleteUserReview(authId, id) {
    let body = JSON.stringify({authId: authId, id: id})
    return await postRequest('/api/review/delete', body)
}

export async function uploadImagesToFirebaseCloud(images) {
    let imagesUrl = []
    let file
    let fileRef
    let downloadUrl
    let uploadTaskSnapshot
    let fileName
    const storageRef = firebase.storage().ref()
    for (let i = 0; i < images.length; i++) {
        file = images[i]
        fileName = generateRandomString()
        try {
            fileRef = storageRef.child('reviews_images/' + fileName)
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
export async function deleteImagesFromFirebaseCloud(pictures) {
    if(pictures && pictures.length) {
        const storage = firebase.storage()
        for (let i = 0; i < pictures?.length; i++) {
            try {
                let url = pictures[i].imageLink
                let imageRef = storage.refFromURL(url)
                const result = await imageRef.delete()
                await deleteImageFromDatabase(url)
            } catch (error) {
                console.log("ERR ===", error);
                alert("Image deleting failed!");
            }
        }
    }
}

export async function addImagesToDatabase(picturesUrl, reviewId) {
    picturesUrl?.forEach(pictureUrl => addImageToDatabase(pictureUrl, reviewId))
}


async function deleteImageFromDatabase(url) {
    let body = JSON.stringify({url})
    return await postRequest('/api/review/deleteImage', body)
}

async function addImageToDatabase(url, reviewId) {
    let body = JSON.stringify({url, reviewId})
    return await postRequest('/api/review/addImage', body)
}



