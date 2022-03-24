import axios from 'axios';

export function postSecretRequest(bearer, url, body) {
  const promise = axios.post(`${process.env.REACT_APP_SERVER_URL}${url}`, body, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
    },
  });
  return promise.then((response) => response.data);
}

export function postRequest(url, body) {
  const promise = axios.post(`${process.env.REACT_APP_SERVER_URL}${url}`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return promise.then((response) => response.data);
}

export function rawPostRequest(url, body) {
  const promise = axios.post(`${process.env.REACT_APP_SERVER_URL}${url}`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return promise.then((response) => response);
}
