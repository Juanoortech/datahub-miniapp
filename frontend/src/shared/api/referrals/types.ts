import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetReferralsResponse = {
    items: {
        user: {
            id: number,
            photo: string,
            name: string,
            balance: number,
            is_premium: boolean,
            language_code: string,
            referral_code: string,
            referral_level: number,
            leaderboard_bonus: number
        },
        specified_referral_earnings: number
    }[],
    page: number,
    last_page: number
    total?: number
}

export type GetReferralsParams = {
    page: number
}

export type GetReferralsTotalInfoResponse = {
    items: {
        sum_of_transaction: number
        date_and_time: string
        from_user: {
            name: string
        }
    }[]
    page: number
    last_page: number
    total?: number
}

export type GetReferralsTotalInfoParams = {
    page: number
}

export type ReferralsApi = {
    fetch: (params: GetReferralsParams) => 
        Promise<ResponseDefault<GetReferralsResponse>>
    fetchTotalInfo: (params: GetReferralsTotalInfoParams) =>
        Promise<ResponseDefault<GetReferralsTotalInfoResponse>>
}