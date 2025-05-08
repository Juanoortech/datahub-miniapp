import {createRequest} from "@/shared/lib/api/createRequest"

import { ViewerApi, GetViewerResponse } from './types'

export const viewerApi: ViewerApi = {
    getViewer: async () => createRequest<GetViewerResponse>({
        url: 'accounts/',
        method: 'GET',
    }),
    completeOnBoarding: async () => createRequest({
        url: 'accounts/first-login/',
        method: 'POST',
    })
}