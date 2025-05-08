import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {downloadApi} from "@/shared/api/download";

const fetch = createAsyncThunk(
    'entities/download/fetch',
    downloadApi.fetch
)

const initialState: {
    ios: string
    android: string
    apk: string

    isPending: boolean
} = {
    isPending: true,

    ios: '',
    android: '',
    apk: '',
}

const downloadSlice = createSlice({
    name: 'entities/download',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetch.pending, state => {
                state.isPending = true
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.ios = payload.payload.ios
                    state.android = payload.payload.android
                    state.apk = payload.payload.apk
                    state.isPending = false
                }
            })
    }
})

export const downloadModel = {
    reducer: downloadSlice.reducer,
    actions: downloadSlice.actions,
    thunks: {
        fetch,
    }
}