import { TimeStamp } from "../types";

export function formatTime(ms: TimeStamp) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours} h`;
    } else if (minutes > 0) {
        return `${minutes} min`;
    } else {
        return `${seconds} sec`;
    }
}

export function formatDate(ms: TimeStamp) {
    const monthNames = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December"
    ];


    const month = monthNames[new Date(ms).getMonth()]
    const day = new Date(ms).getDate()
    const year = new Date(ms).getFullYear()

    return `${month} ${day}, ${year}`
}

export async function delay(ms: TimeStamp = 2_000 as TimeStamp) {
    await new Promise(resolve => setTimeout(resolve, ms))
}

export function toFormatedDate(ms: TimeStamp) {
    const date = new Date(ms)

    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1

    return `${day}.${month}.${date.getFullYear()}`
}

export function ISOtoTimeString(iso: string): TimeStamp {
    const parts = iso.match(/P(\d+D)?T?(\d+H)?(\d+M)?(\d+S)?/);

    if (!parts) return 0 as TimeStamp

    let days = parseInt(parts[1]) || 0
    let hours = parseInt(parts[2]) || 0
    let minutes = parseInt(parts[3]) || 0
    let seconds = parseFloat(parts[4]) || 0

    return (
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000
    ) as TimeStamp
}

export function isToday(timestamp: TimeStamp) {
    const date = new Date(timestamp);
    const today = new Date();

    return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
}

export function isYesterday(timestamp: TimeStamp) {
    const date = new Date(timestamp);
    const yesterday = new Date();

    // Установка времени на начало дня
    yesterday.setHours(0, 0, 0, 0);
    // Вычитание одного дня
    yesterday.setDate(yesterday.getDate() - 1);

    return date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();
}

export function normalizeTimestamp(timestamp: TimeStamp) {
    const date = new Date(timestamp)
    date.setHours(0, 0, 0, 0)

    return date.getTime()
}
