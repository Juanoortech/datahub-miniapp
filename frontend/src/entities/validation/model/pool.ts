import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

import {FetchValidationExpandResponse, validationApi} from "@/shared/api/validation"

import {ValidationExpand} from './types'

const fetch = createAsyncThunk(
    'entities/validation/pool/fetch',
    validationApi.fetchExpand,
)

const initialState: {
    pool: Record<ValidationExpand['taskId'], ValidationExpand>

    isPending: boolean
} = {
    pool: {},
    isPending: true
}

const poolValidationSlice = createSlice({
    name: 'entities/validation/pool',
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
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.pool = {
                        ...state.pool,
                        [payload.payload!.task.id]: toDomain(payload.payload)
                    }
                    state.isPending = false
                }
            })
    }
})

export const validationPoolModel = {
    reducer: poolValidationSlice.reducer,
    actions: poolValidationSlice.actions,
    thunks: {
        fetch,
    }
}

function toDomain(data: FetchValidationExpandResponse): ValidationExpand {
    return {
        taskId: data.task.id,
        completionId: data.id,
        type: data.task.internal_type,
        details: data.task.text,
        data: data.file.url,
        reward: data.task.reward,
    }
}
