import { postRequest, postSecretRequest, rawPostRequest } from '../index.network';

export async function registerNewUser(token, authId, name, picture) {
  const body = JSON.stringify({ authId: authId, name: name, picture: picture });
  return await postSecretRequest(token, '/api/user/registration', body);
}

export async function changeUserName(authId, newUserName) {
  const body = JSON.stringify({ authId, newUserName });
  return await rawPostRequest('/api/user/changeName', body);
}

export async function getUserById(id) {
  const body = JSON.stringify({ id: id });
  return await postRequest('/api/user/getUserById', body);
}

export async function getUserByAuthId(token, authId) {
  const body = JSON.stringify({ authId: authId });
  return await postSecretRequest(token, '/api/user/getUser', body);
}

export async function getAllUsers() {
  return await postRequest('/api/user/getUsers', {});
}
