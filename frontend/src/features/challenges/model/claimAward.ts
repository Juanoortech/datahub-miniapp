import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {challengesApi} from "@/shared/api/challenges";
import {Challenge} from "@/entities/challenges/model/types";

const claimAward = createAsyncThunk(
    'features/challenges/claimAward/thunk',
    async (challenge: Challenge) => {
        const { error, payload } = await challengesApi.claim(challenge)

        if (error || !payload) {
            return {
                error: true,
                challenge,
                claimed: false
            }
        }

        return {
            error: false,
            challenge,
            claimed: payload.claim_prize === 'claimed',
        }
    },
)

const initialState: {
    isPending: boolean
    state: 'idle' | 'success' | 'error' | 'not claimed',
} = {
    isPending: false,
    state: 'idle',
}

const claimAwardSlice = createSlice({
    name: 'features/challenges/claimAward',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = false
            state.state = 'idle'
        }
    },
    extraReducers: builder => {
        builder
            .addCase(claimAward.pending, state => {
                state.isPending = true
            })
            .addCase(claimAward.fulfilled, (state, { payload }) => {
                state.isPending = false
                console.log(payload.error, payload.claimed)
                if (payload.error) {
                    state.state = 'error'
                } else {
                    if (payload.claimed) {
                        state.state = 'success'
                    } else {
                        state.state = 'not claimed'
                    }
                }
            })
    }
})

export const claimedAwardModel = {
    reducer: claimAwardSlice.reducer,
    actions: claimAwardSlice.actions,
    thunks: {
        claimAward,
    }
}