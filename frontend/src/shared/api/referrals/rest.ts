import { ReferralsApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";
import {queryParams} from "@/shared/lib/api/queryParams";
import {EarningsType, TransactionType} from "@/shared/api/enums";

export const referralsApi: ReferralsApi = {
    fetch: ({ page }) =>
        createRequest({
            url: `accounts/referrals/${queryParams({
                page,
            })}`,
            method: 'GET',
        }),
    fetchTotalInfo: ({ page }) =>
        createRequest({
            url: `accounts/transactions/${queryParams({
                page,
                internal_type: TransactionType.EARNINGS,
                type_of_deposit: EarningsType.REFERRAL,
            })}`,
            method: 'GET',
        })
}