import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums";
import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type GetTransactionsListResponse = {
    items: {
        internal_type: TransactionType
        type_of_deposit?: EarningsType | null
        status?: WithdrawStatus | null
        sum_of_transaction: number
        date_and_time: string
        from_user: {
            name: string
        }
    }[]
    page: number
    last_page: number
    total: number
}

export type GetTransactionsListParams = {
    page: number
    transactionType?: TransactionType[]
    withdrawStatus?: WithdrawStatus[]
    earningType?: EarningsType[]
}

export type TransactionApi = {
    fetch: (params: GetTransactionsListParams) =>
        Promise<ResponseDefault<GetTransactionsListResponse>>
}