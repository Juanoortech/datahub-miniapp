import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

import {claimedAwardModel} from "@/features/challenges/model"

import {challengesApi} from "@/shared/api/challenges"
import {GetActiveChallengesResponse, GetCompletedChallengesResponse} from "@/shared/api/challenges/types"
import {ISOtoTimeString} from "@/shared/lib/time"
import {TimeStamp} from "@/shared/lib/types"

import { Challenge } from './types'

const fetch = createAsyncThunk(
    'entities/challenges/completedList/fetch',
    challengesApi.fetchCompleted,
)

const fetchNextPage = createAsyncThunk(
    'entities/challenges/completedList/fetchNextPage',
    challengesApi.fetchCompleted,
)

const initialState: {
    list: Challenge[]
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

const challengesSlice = createSlice({
    name: 'entities/challenges/completedList',
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
            .addCase(claimedAwardModel.thunks.claimAward.fulfilled, (state, { payload }) => {
                if (payload.claimed) {
                    state.list = [
                        payload.challenge,
                        ...state.list,
                    ]
                }
            })
    }
})

export const completedChallengesModel = {
    reducer: challengesSlice.reducer,
    actions: challengesSlice.actions,
    thunks: {
        fetch,
        fetchNextPage
    }
}

function toDomain(data: GetCompletedChallengesResponse): Challenge[] {
    return data.items.map(item => ({
        id: item.challenge.id,
        avatar: item.challenge.avatar,
        title: item.challenge.title,
        award: item.challenge.reward,
        type: item.challenge.internal_type,
        status: item.status,
        actionText: item.challenge.button_text,
        moderationTime: item.challenge.imitation_timer
            ? ISOtoTimeString(item.challenge.imitation_timer)
            : 0 as TimeStamp,
        link: item.challenge.redirect_link,
        channel: item.challenge.channel ? item.challenge.channel : undefined,
    }))
}

function hasNextPage(data: GetCompletedChallengesResponse | GetActiveChallengesResponse): boolean {
    return data.page < data.last_page
}