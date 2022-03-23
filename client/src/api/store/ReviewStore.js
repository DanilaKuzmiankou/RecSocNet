import { postRequest } from '../index.network';
import { generateRandomString } from '../../utils/Utils';
import firebase from '../../utils/Firebase';

export async function getUserReviews(authId, userId) {
  const body = JSON.stringify({ authId: authId, userId: userId });
  return await postRequest('/api/review/getAuthorReviews', body);
}

export async function getNewestReviews(limit, offset, userId) {
  const body = JSON.stringify({ limit, offset, userId });
  return await postRequest('/api/review/newestReviews', body);
}

export async function getMostLikedReviews(limit, offset, userId) {
  const body = JSON.stringify({ limit, offset, userId });
  return await postRequest('/api/review/mostLikedReviews', body);
}

export async function getTagReviews(limit, offset, userId, tag) {
  const body = JSON.stringify({ limit, offset, userId, tag });
  return await postRequest('/api/review/tagReviews', body);
}

export async function getTags() {
  return await postRequest('/api/review/tags', {});
}

export async function findReviews(limit, offset, searchedString, userId) {
  const body = JSON.stringify({ limit, offset, searchedString, userId });
  return await postRequest('/api/review/findReviews', body);
}

export async function saveEditedReview(review) {
  const body = JSON.stringify({ review: review });
  return await postRequest('/api/review/edit', body);
}

export async function saveNewReview(authId, review) {
  const body = JSON.stringify({ authId: authId, review: review });
  return await postRequest('/api/review/create', body);
}

export async function deleteUserReview(authId, id) {
  const body = JSON.stringify({ authId: authId, id: id });
  return await postRequest('/api/review/delete', body);
}

export async function uploadImagesToFirebaseCloud(images) {
  const imagesUrl = [];
  let file;
  let fileRef;
  let downloadUrl;
  let uploadTaskSnapshot;
  let fileName;
  const storageRef = firebase.storage().ref();
  for (let i = 0; i < images.length; i++) {
    file = images[i];
    if (file.preview) {
      fileName = generateRandomString();
      try {
        fileRef = storageRef.child('reviews_images/' + fileName);
        uploadTaskSnapshot = await fileRef.put(file);
        downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();
        imagesUrl[i] = downloadUrl;
      } catch (error) {
        console.log('ERR ===', error);
        alert('Image uploading failed!');
      }
    }
  }
  return imagesUrl;
}

export async function deleteImagesFromFirebaseCloud(pictures) {
  if (pictures && pictures.length) {
    const storage = firebase.storage();
    for (let i = 0; i < pictures?.length; i++) {
      try {
        const url = pictures[i].imageLink;
        const imageRef = storage.refFromURL(url);
        await imageRef.delete();
        await deleteImageFromDatabase(url);
      } catch (error) {
        console.log('ERR ===', error);
        alert('Image deleting failed!');
      }
    }
  }
}

export async function addImagesToDatabase(picturesUrl, reviewId) {
  picturesUrl?.forEach((pictureUrl) => addImageToDatabase(pictureUrl, reviewId));
}

async function deleteImageFromDatabase(url) {
  const body = JSON.stringify({ url });
  return await postRequest('/api/review/deleteImage', body);
}

async function addImageToDatabase(url, reviewId) {
  const body = JSON.stringify({ url, reviewId });
  return await postRequest('/api/review/addImage', body);
}
