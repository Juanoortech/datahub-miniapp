import { TokenApi, GenerateTokenResponse } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";

export const tokenApi: TokenApi = {
    generateToken: async data => createRequest<GenerateTokenResponse>({
        url: 'accounts/token/',
        method: 'POST',
        withAuth: false,
        data,
    })
}