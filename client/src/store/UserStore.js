import {getRequest, getSecretRequest, postRequest, postSecretRequest} from "../api/index.network";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone" // dependent on utc plugin
import moment from "moment-timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function registerNewUser(token: string, authId: string, name: string) {
    let body = JSON.stringify({authId: authId, name: name})
    return await postSecretRequest(token, '/api/user/registration', body)
}

export async function getUserById(id: number) {
    console.log('id: ', id)
    let url = '/api/user/getUserById/' + id
    console.log('url: ', url)
    return await getRequest(url)
}

export async function getUserById2(id: number) {
    let body = JSON.stringify({id: id})
    return await postSecretRequest('/api/user/getUserById2', body)
}

export async function getUserByAuthId(token: string, authId: string) {
    let body = JSON.stringify({authId: authId})
    return await postSecretRequest(token, '/api/user/getUser', body)
}

export async function getUserReviews(authId: string) {
    let body = JSON.stringify({authId: authId})
    return await postRequest('/api/review/getAuthorReviews', body)
}


async function changeDateToUserTimezone(users: Array) {
    let clientTimeZone = dayjs.tz.guess()
    for (let i = 0; i < users.length; i++) {
        let c = formatTime(new Date(users[i].updatedAt), clientTimeZone)
        let d = users[i].updatedAt
        users[i].updatedAt = formatTime(new Date(users[i].updatedAt), clientTimeZone)
        users[i].createdAt = formatTime(new Date(users[i].createdAt), clientTimeZone)
    }
    return users
}

function formatTime(date: Date, timeZone: string) {
    let time = moment.tz(date, timeZone)
    return time.format(process.env.REACT_APP_DATESTRING_FORMAT).replace(/['"]+/g, ''); /* timezone_string = "Australia/Sydney" */
}

export async function getAllUsers(token: string) {
    let data = await getSecretRequest(token, '/api/user/users')
    return await changeDateToUserTimezone(data)
}