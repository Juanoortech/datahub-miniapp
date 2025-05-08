import {ReferralsApi, GetReferralsResponse, GetReferralsTotalInfoResponse} from './types'
import {delay} from "@/shared/lib/time"

export const referralsApi: ReferralsApi = {
    fetch: async ({
        page
    }) => {
        await delay()

        function getList(): GetReferralsResponse['items'] {
            return Array(10).fill(page).map((page, key) => {
                const id = (page - 1) * 10 + key

                return {
                    user: {
                        id,
                        photo: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                        name: `Name ${id}`,
                        balance: 10_000 - 1,
                        is_premium: false,
                        language_code: '',
                        referral_code: '',
                        referral_level: 0,
                        leaderboard_bonus: 0
                    },
                    specified_referral_earnings: 1250,
                }
            })
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page,
                last_page: 3,
                total: 30,
            }
        }
    },
    fetchTotalInfo: async ({
        page
    }) => {
        await delay()

        function getList(): GetReferralsTotalInfoResponse['items'] {
            return Array(10).fill(page).map((page, key) => {
                const id = (page - 1) * 10 + key

                return {
                    sum_of_transaction: 250,
                    date_and_time: new Date().toUTCString(),
                    from_user: {
                        name: `Name ${id}`
                    }
                }
            })
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page,
                last_page: 3,
                total: 30,
            }
        }
    }
}