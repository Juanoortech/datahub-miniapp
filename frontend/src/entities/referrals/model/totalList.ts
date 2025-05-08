import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid'

import {referralsApi} from "@/shared/api/referrals"
import {GetReferralsTotalInfoResponse} from "@/shared/api/referrals/types"

import { ReferralTransaction } from './types'
import {TimeStamp} from "@/shared/lib/types";

const fetch = createAsyncThunk(
    'entities/referrals/total/fetch',
    referralsApi.fetchTotalInfo
)

const fetchNextPage = createAsyncThunk(
    'entities/referrals/total/fetchNextPage',
    referralsApi.fetchTotalInfo
)

const initialState: {
    list: ReferralTransaction[]
    page: number
    total?: number
    hasNextPage: boolean

    isPending: boolean
    isPaginating: boolean
} = {
    list: [],
    page: 1,
    total: 0,
    hasNextPage: false,
    isPending: true,
    isPaginating: false
}

const referralsTotalSlice = createSlice({
    name: 'entities/referrals/totla',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetch.pending, state => {
                state.isPending = true
                state.isPaginating = false
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.list = toDomain(payload.payload)
                    state.isPending = false
                    state.isPaginating = false
                    state.page = 1
                    state.hasNextPage = hasNextPage(payload.payload)
                    state.total = payload.payload.total ?? 0
                }
            })
            .addCase(fetchNextPage.pending, state => {
                state.isPaginating = true
            })
            .addCase(fetchNextPage.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.list = [
                        ...state.list,
                        ...toDomain(payload.payload)
                    ]
                    state.isPending = false
                    state.isPaginating = false
                    state.page = payload.payload.page
                    state.hasNextPage = hasNextPage(payload.payload)
                    state.total = payload.payload.total ?? 0
                }
            })
    }
})

export const totalListModel = {
    reducer: referralsTotalSlice.reducer,
    actions: referralsTotalSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
    }
}

function toDomain(data: GetReferralsTotalInfoResponse): ReferralTransaction[] {
    return data.items.map(item => ({
        id: uuidv4(),
        name: item.from_user.name,
        date: new Date(item.date_and_time).getTime() as TimeStamp,
        amount: item.sum_of_transaction,
    }))
}

function hasNextPage(data: GetReferralsTotalInfoResponse): boolean {
    return data.page < data.last_page
}