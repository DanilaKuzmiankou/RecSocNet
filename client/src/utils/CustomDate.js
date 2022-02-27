import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone" // dependent on utc plugin
import moment from "moment-timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function changeDateToUserTimezone(array: Array) {
    let clientTimeZone = dayjs.tz.guess()
    for (let i = 0; i < array.length; i++) {
        array[i].updatedAt = formatTime(new Date(array[i].updatedAt), clientTimeZone)
        array[i].createdAt = formatTime(new Date(array[i].createdAt), clientTimeZone)
    }
    return array
}

export function changeSingleDateToUserTimezone(str: String) {
        let clientTimeZone = dayjs.tz.guess()
        str = formatTime(new Date(str), clientTimeZone)
    return str
}

function formatTime(date: Date, timeZone: string) {
    let time = moment.tz(date, timeZone)
    return time.format(process.env.REACT_APP_DATESTRING_FORMAT).replace(/['"]+/g, ''); /* timezone_string = "Australia/Sydney" */
}