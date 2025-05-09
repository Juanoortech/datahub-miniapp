import {ResponseDefault} from "@/shared/lib/api/createRequest"

export type GetViewerResponse = {
    wallet_address: string,
    photo: string,
    name: string,
    banned: boolean,
    balance: number,
    is_premium: boolean,
    referral_code: string,
    referral_level: number,
    referral_earnings: number,
    leaderboard_bonus: number,
    wallet_was_connected: boolean,
    wallet_connect_code: string,
    first_login: boolean
}

export type ViewerApi = {
    getViewer: () => Promise<ResponseDefault<GetViewerResponse>>
    completeOnBoarding: () => Promise<ResponseDefault<null>>
}