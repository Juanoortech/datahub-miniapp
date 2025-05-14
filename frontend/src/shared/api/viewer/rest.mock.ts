import { ViewerApi } from './types'
import {delay} from "@/shared/lib/time";

let isFirstUse = true

export const viewerApi: ViewerApi = {
    getViewer: async () => {
        await delay()

        return {
            error: false,
            payload: {
                wallet_address: '0x0000000000000000000000000000000000000000',
                photo: '',
                name: 'name',
                banned: false,
                balance: 3_000,
                referral_code: 'XGHSREW',
                referral_level: 2,
                referral_earnings: 10_000,
                leaderboard_bonus: 20,
                wallet_was_connected: false,
                wallet_connect_code: '',
                first_login: isFirstUse,
            }
        }
    },
    completeOnBoarding: async () => {
        await delay()

        isFirstUse = false

        return {
            error: false,
            payload: null,
        }
    }
}