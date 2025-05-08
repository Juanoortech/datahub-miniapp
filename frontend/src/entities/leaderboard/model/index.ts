import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

import {leaderboardApi} from "@/shared/api/leaderboard"
import {GetLeaderboardResponse} from "@/shared/api/leaderboard/types";

import { LeaderBoardItem } from './types'

const fetch = createAsyncThunk(
    'entities/leaderboard/fetch',
    leaderboardApi.fetch
)
const fetchViewerState = createAsyncThunk(
    'entities/leaderboard/fetchViewerState',
    leaderboardApi.fetchViewerInfo,
)

const fetchNextPage = createAsyncThunk(
    'entities/leaderboard/fetchNextPage',
    leaderboardApi.fetch
)

const initialState: {
    list: LeaderBoardItem[]
    viewerPlace: number
    viewerPoints: number
    viewerBonus: number

    page: number
    total?: number
    hasNextPage: boolean

    isPending: boolean
    isPendingViewerState: boolean
    isPaginating: boolean
} = {
    list: [],
    viewerPlace: 0,
    viewerPoints: 0,
    viewerBonus: 0,

    page: 1,
    total: 0,
    hasNextPage: false,
    isPending: true,
    isPendingViewerState: true,
    isPaginating: false
}

const leaderboardSlice = createSlice({
    name: 'entities/leaderboard',
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
            .addCase(fetchViewerState.pending, state => {
                state.isPendingViewerState = true
            })
            .addCase(fetchViewerState.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.isPendingViewerState = false
                    state.isPaginating = false
                    state.viewerPlace = payload.payload.viewer_place
                    state.viewerPoints = payload.payload.viewer_points
                    state.viewerBonus = payload.payload.viewer_bonus
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
                    console.log(state.hasNextPage)
                    state.total = payload.payload.total ?? 0
                }
            })
    }
})

export const leaderboardModel = {
    reducer: leaderboardSlice.reducer,
    actions: leaderboardSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
        fetchViewerState,
    }
}

function toDomain(data: GetLeaderboardResponse): LeaderBoardItem[] {
    return data.items.map(item => ({
        ...item
    }))
}

function hasNextPage(data: GetLeaderboardResponse): boolean {
    return data.page < data.last_page
}