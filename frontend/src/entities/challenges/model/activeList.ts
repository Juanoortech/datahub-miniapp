import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

import {claimedAwardModel, startModel} from "@/features/challenges/model";

import {challengesApi} from "@/shared/api/challenges"
import {GetActiveChallengesResponse, GetCompletedChallengesResponse} from "@/shared/api/challenges/types";
import {ISOtoTimeString} from "@/shared/lib/time"
import {ChallengeStatus, ChallengeType} from "@/shared/api/enums"
import {TimeStamp} from "@/shared/lib/types";

import {Challenge} from './types'

const fetch = createAsyncThunk(
    'entities/challenges/activeList/fetch',
    challengesApi.fetchActive,
)

const fetchNextPage = createAsyncThunk(
    'entities/challenges/activeList/fetchNextPage',
    challengesApi.fetchActive,
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
    name: 'entities/challenges/activeList',
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
            .addCase(startModel.thunks.start.fulfilled, (state, { payload }) => {
                console.log('case activeList', payload)
                if (!payload.error) {
                    const index = state.list.findIndex(item => item.id === payload.challenge.id)
                    console.log('case activeList index', index)
                    if (index !== -1 && payload.started) {
                        state.list[index] = {
                            ...state.list[index],
                            status: payload.challenge.type === ChallengeType.IMITATION
                                ? ChallengeStatus.IN_PROGRESS
                                : ChallengeStatus.NOT_CLAIMED,
                        }
                    }
                }
            })
            .addCase(claimedAwardModel.thunks.claimAward.fulfilled, (state, { payload }) => {
                if (payload.claimed) {
                    state.list = state.list.filter(item => item.id !== payload.challenge.id)
                }
            })
    }
})

export const activeChallengesModel = {
    reducer: challengesSlice.reducer,
    actions: challengesSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
    }
}

function toDomain(data: GetActiveChallengesResponse): Challenge[] {
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
        channel: item.challenge.channel,
    }))
}

function hasNextPage(data: GetCompletedChallengesResponse | GetActiveChallengesResponse): boolean {
    return data.page < data.last_page
}