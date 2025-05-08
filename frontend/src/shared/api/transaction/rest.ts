import { TransactionApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";
import {queryParams} from "@/shared/lib/api/queryParams";

export const transactionApi: TransactionApi = {
    fetch: async ({ page, transactionType, earningType, withdrawStatus }) =>
        createRequest({
            url: `accounts/transactions/${queryParams({
                page,
                internal_type: transactionType?.length ? transactionType.join(',') : undefined,
                type_of_deposit: earningType?.length ? earningType.join(',') : undefined,
                status: withdrawStatus?.length ? withdrawStatus.join(',') : undefined
            })}`,
            method: 'GET',
        })
}