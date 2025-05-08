import { DownloadApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";

export const downloadApi: DownloadApi = {
    fetch: async () => createRequest({
        url: 'service/app-links/',
        method: 'GET',
    })
}