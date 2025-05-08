import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

import {referralsApi} from "@/shared/api/referrals"
import {GetReferralsResponse} from "@/shared/api/referrals/types";

import { Referral } from './types'

const fetch = createAsyncThunk(
    'entities/referrals/fetch',
    referralsApi.fetch
)

const fetchNextPage = createAsyncThunk(
    'entities/referrals/fetchNextPage',
    referralsApi.fetch
)

const initialState: {
    list: Referral[]
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

const referralsSlice = createSlice({
    name: 'entities/referrals',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = true
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

export const referralsModel = {
    reducer: referralsSlice.reducer,
    actions: referralsSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
    }
}

function toDomain(data: GetReferralsResponse): Referral[] {
    return data.items.map(item => ({
        id: item.user.id,
        avatar: item.user.photo,
        name: item.user.name,
        earnings: item.specified_referral_earnings
    }))
}

function hasNextPage(data: GetReferralsResponse): boolean {
    return data.page < data.last_page
}