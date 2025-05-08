import {delay} from "@/shared/lib/time"

import { TokenApi } from './types'

export const tokenApi: TokenApi = {
    generateToken: async () => {
        await delay()

        return {
            error: false,
            payload: {
                token: 'mock_token'
            }
        }
    }
}