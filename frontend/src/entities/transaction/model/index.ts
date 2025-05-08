import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid'

import {transactionApi} from "@/shared/api/transaction"
import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums"
import {GetTransactionsListResponse} from "@/shared/api/transaction/types"
import {TimeStamp} from "@/shared/lib/types"
import {normalizeTimestamp} from "@/shared/lib/time"

import { TransactionGroup, TransactionItem } from './types'

const fetch = createAsyncThunk(
    'entities/transactions/fetch',
    transactionApi.fetch
)

const fetchNextPage = createAsyncThunk(
    'entities/transactions/fetchNextPage',
    transactionApi.fetch
)

const initialState: {
    pool: Record<string, TransactionGroup>
    page: number

    isPending: boolean
    isPaginating: boolean
    hasNextPage: boolean

    transactionType: TransactionType[]
    withdrawStatus: WithdrawStatus[]
    earningsType: EarningsType[]
} = {
    pool: {},
    page: 1,

    isPending: true,
    isPaginating: false,
    hasNextPage: false,

    transactionType: [],
    withdrawStatus: [],
    earningsType: [],
}

const transactionSlice = createSlice({
    name: 'entities/transactions',
    initialState,
    reducers: {
        setTransactionType: (state, { payload }: PayloadAction<TransactionType[]>) => {
            state.transactionType = payload
            if (!payload.includes(TransactionType.EARNINGS)) {
                state.earningsType = []
            }
            if (!payload.includes(TransactionType.WITHDRAW)) {
                state.withdrawStatus = []
            }
        },
        setWithdrawStatus: (state, { payload }: PayloadAction<WithdrawStatus[]>) => {
            state.withdrawStatus = payload
        },
        setEarningsType: (state, { payload }: PayloadAction<EarningsType[]>) => {
            state.earningsType = payload
        },
        resetFilter: state => {
            state.transactionType = []
            state.withdrawStatus = []
            state.earningsType = []
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetch.pending, state => {
                state.isPending = true
                state.isPaginating = false
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.pool = toDomain({}, payload.payload)
                    state.page = payload.payload.page
                    state.isPaginating = false
                    state.isPending = false
                    state.hasNextPage = payload.payload.page < payload.payload.last_page
                }
            })
            .addCase(fetchNextPage.pending, state => {
                state.isPaginating = true
            })
            .addCase(fetchNextPage.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.pool = toDomain(state.pool, payload.payload)
                    state.page = payload.payload.page
                    state.isPaginating = false
                    state.isPending = false
                    state.hasNextPage = payload.payload.page < payload.payload.last_page
                }
            })
    }
})

export const transactionModel = {
    reducer: transactionSlice.reducer,
    actions: transactionSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
    }
}
export * from './types'

function toDomain(
    state: Record<string, TransactionGroup>,
    data: GetTransactionsListResponse
): Record<string, TransactionGroup> {
    const groupPool = {
        ...state
    }
    const domainList = data.items.map(item => {
        if (item.internal_type === TransactionType.WITHDRAW) {
            return {
                id: uuidv4(),
                date: new Date(item.date_and_time).getTime() as TimeStamp,
                amount: item.sum_of_transaction,
                type: TransactionType.WITHDRAW,
                withdrawStatus: item.status ?? WithdrawStatus.PENDING,
            } as TransactionItem
        }

        return {
            id: uuidv4(),
            date: new Date(item.date_and_time).getTime() as TimeStamp,
            amount: item.sum_of_transaction,
            type: TransactionType.EARNINGS,
            earningsType: item.type_of_deposit ?? EarningsType.TASK,
            referralName: item.from_user?.name,
        } as TransactionItem
    })

    domainList.forEach(item => {
        const key = normalizeTimestamp(item.date)

        if (
            `${key}` in groupPool
        ) {
            groupPool[`${key}`].items.push(item)
        } else {
            groupPool[`${key}`] = {
                date: item.date,
                items: [
                    item,
                ]
            }
        }
    })

    return groupPool
}
