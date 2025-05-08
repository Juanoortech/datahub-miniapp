import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {validationApi} from "@/shared/api/validation";

const sendResult = createAsyncThunk(
    'features/validation/sendResult',
    validationApi.sendResult
)

const initialState: {
    isPending: boolean
    isSuccess: boolean
    rate: number
} = {
    isPending: false,
    isSuccess: false,
    rate: 0
}

const validationSlice = createSlice({
    name: 'features/validation',
    initialState,
    reducers: {
        setRate: (state, { payload }: PayloadAction<number>) => {
            state.rate = payload
        },
        reset: state => {
            state.rate = 0
            state.isSuccess = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(sendResult.pending, state => {
                state.isPending = true
            })
            .addCase(sendResult.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.isPending = false
                    state.isSuccess = true
                }
            })
    }
})

export const validateResultModel = {
    reducer: validationSlice.reducer,
    actions: validationSlice.actions,
    thunks: {
        sendResult,
    }
}