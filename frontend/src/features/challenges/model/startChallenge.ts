import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {challengesApi} from "@/shared/api/challenges";
import {Challenge} from "@/entities/challenges/model/types";

const start = createAsyncThunk(
    'features/challenges/start/thunk',
    async (challenge: Challenge) => {
        const { error, payload } = await challengesApi.start(challenge)

        if (error || !payload) {
            return {
                error: true,
                challenge,
                started: false
            }
        }

        return {
            error: false,
            challenge,
            started: payload.created,
        }
    },
)

const initialState: {
    state: 'idle' | 'pending' | 'success' | 'error',
} = {
    state: 'idle',
}

const startSlice = createSlice({
    name: 'features/challenges/start',
    initialState,
    reducers: {
        reset: state => {
            state.state = 'idle'
        },
        setState: (state, { payload }: PayloadAction<'idle' | 'pending' | 'success' | 'error'>) => {
            console.log('setState', payload)
            state.state = payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(start.pending, state => {
                state.state = 'pending'
            })
            .addCase(start.fulfilled, (state, { payload }) => {
                if (payload.error) {
                    state.state = 'error'
                } else {
                    state.state = 'success'
                }
            })
    }
})

export const startModel = {
    reducer: startSlice.reducer,
    actions: startSlice.actions,
    thunks: {
        start,
    }
}