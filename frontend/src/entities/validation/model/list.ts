import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"

import {validationApi} from "@/shared/api/validation"
import {TaskType} from "@/shared/api/enums"
import {FetchValidationsListResponse} from "@/shared/api/validation/types"

import { ValidationListItem } from './types'

const fetch = createAsyncThunk(
    'entities/validation/fetch',
    validationApi.fetch
)

const fetchNextPage = createAsyncThunk(
    'entities/validation/fetchNextPage',
    validationApi.fetch
)

const initialState: {
    activeType: TaskType[]
    list: ValidationListItem[]

    page: number
    hasNextPage: boolean

    isPending: boolean
    isPaginating: boolean
} = {
    activeType: [],
    list: [],

    page: 1,
    hasNextPage: false,

    isPending: true,
    isPaginating: false
}

const validationSlice = createSlice({
    name: 'entities/validation',
    initialState,
    reducers: {
        setActiveType: (state, { payload }: PayloadAction<TaskType[]>) => {
            state.activeType = payload
        },
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
                    state.list = [
                        ...state.list,
                        ...toDomain(payload.payload),
                    ]
                    state.page = payload.payload.page
                    state.isPaginating = false
                    state.isPending = false
                    state.hasNextPage = payload.payload.page < payload.payload.last_page
                }
            })
    }
})

export const validationListModel = {
    reducer: validationSlice.reducer,
    actions: validationSlice.actions,
    thunks: {
        fetch,
        fetchNextPage,
    }
}

function toDomain(data: FetchValidationsListResponse): ValidationListItem[] {
    return data.items.map(item => ({
        id: item.task.id,
        type: item.task.internal_type,
        title: item.task.title,
        image: item.task.photo,
        reward: item.task.reward,
        available: item.available,
    }))
}