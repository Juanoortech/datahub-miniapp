import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetDownloadsResponse = {
    ios: string
    android: string
    apk: string
}

export type DownloadApi = {
    fetch: () => Promise<ResponseDefault<GetDownloadsResponse>>
}