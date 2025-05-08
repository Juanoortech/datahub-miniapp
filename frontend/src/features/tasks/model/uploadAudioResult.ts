import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {activeTaskApi, UploadVideoResponse} from "@/shared/api";

const upload = createAsyncThunk(
    'feature/tasks/uploadAudioResult',
    activeTaskApi.uploadAudioResult
)

const initialState: {
    isPending: boolean
    isSuccess: boolean
    errorCode: null | number
} = {
    isPending: false,
    isSuccess: false,
    errorCode: null,
}

const uploadAudioSlice = createSlice({
    name: 'feature/uploadAudioResult',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = false
            state.isSuccess = false
            state.errorCode = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(upload.pending, state => {
                state.isPending = true
                state.isSuccess = false
                state.errorCode = null
            })
            .addCase(upload.fulfilled, (state, { payload }: PayloadAction<UploadVideoResponse>) => {
                if (!payload.error) {
                    state.isPending = false
                    if (payload.payload.status) {
                        state.isSuccess = true
                    } else {
                        state.errorCode = payload.payload.errorCode
                    }
                }
            })
        }
})

export const uploadAudioResultModel = {
    reducer: uploadAudioSlice.reducer,
    actions: uploadAudioSlice.actions,
    thunks: {
        upload
    }
}
