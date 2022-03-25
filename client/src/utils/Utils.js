import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import moment from 'moment-timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function changeDateToUserTimezone(array) {
  const clientTimeZone = dayjs.tz.guess();
  for (let i = 0; i < array.length; i++) {
    array[i].updatedAt = formatTime(new Date(array[i].updatedAt), clientTimeZone);
    array[i].createdAt = formatTime(new Date(array[i].createdAt), clientTimeZone);
  }
  return array;
}

export function changeSingleDateToUserTimezone(str) {
  const clientTimeZone = dayjs.tz.guess();
  str = formatTime(new Date(str), clientTimeZone);
  return str;
}

function formatTime(date, timeZone) {
  const time = moment.tz(date, timeZone);
  return time.format(process.env.REACT_APP_DATESTRING_FORMAT).replace(/['"]+/g, '');
}

function dec2hex(dec) {
  return dec.toString(16).padStart(2, '0');
}

export function generateRandomString(len) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function formatStringLength(formattingString, maxLength) {
  if (formattingString.length > maxLength) {
    formattingString = formattingString.substring(0, maxLength) + '...';
  }
  return formattingString;
}

export function onImageDownloadError(
  currentTarget,
  setImageGetAttempt,
  imageGetAttempt,
  currentUser
) {
  setTimeout(async () => {
    currentTarget.onerror = null;
    setImageGetAttempt((imageGetAttempt) => imageGetAttempt + 1);
    currentTarget.src =
      imageGetAttempt < 10
        ? currentUser.profilePictureUrl
        : process.env.PUBLIC_URL + '/blank_profile_picture.png';
  }, 50);
}
