import { balanceApi } from '@/shared/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const fetchBalance = createAsyncThunk(
    'balance/fetchBalance',
    balanceApi.fetch,
)

const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        value: 0,
        isPending: true,
    },
    reducers: {
        update: (state, { payload }: PayloadAction<number>) => {
            state.value = payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBalance.pending, state => {
                state.isPending = true
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                console.log('fetchBalance.fulfilled')
                state.isPending = false
                state.value = action.payload.payload.balance
            })
    }
})

export const balanceModel = {
    reducer: balanceSlice.reducer,
    actions: {
        update: balanceSlice.actions.update,
    },
    thunks: {
        fetchBalance,
    }
}