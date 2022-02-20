import axios from "axios";

export function getSecretRequest(bearer: string, url: string) {
    const promise = axios
        .get(`${process.env.REACT_APP_SERVER_URL}${url}`, {

            headers: {
                Authorization: `Bearer ${bearer}`,
                'Content-Type': 'application/json'
            }

        })

    return promise.then((response) => response.data);
}

export function getRequest(url: string) {
    const promise = axios
        .get(`${process.env.REACT_APP_SERVER_URL}${url}`, {

            headers: {
                'Content-Type': 'application/json'
            }

        })

    return promise.then((response) => response.data);
}


export function postSecretRequest(bearer: string, url: string, body: string) {
    const promise = axios
        .post(`${process.env.REACT_APP_SERVER_URL}${url}`, body, {
            headers: {
                Authorization: `Bearer ${bearer}`,
                'Content-Type': 'application/json'
            }
        })
    return promise.then((response) => response.data);
}

export function postRequest(url: string, body: string) {
    const promise = axios
        .post(`${process.env.REACT_APP_SERVER_URL}${url}`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return promise.then((response) => response.data);
}