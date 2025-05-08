import { activeTaskApi, UploadPhotoResponse } from "@/shared/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const upload = createAsyncThunk(
    'feature/tasks/uploadVideoResult',
    activeTaskApi.uploadVideoResult
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

const uploadSlice = createSlice({
    name: 'feature/uploadVideoResult',
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
            .addCase(upload.fulfilled, (state, { payload }: PayloadAction<UploadPhotoResponse>) => {
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

export const uploadVideoResultModel = {
    reducer: uploadSlice.reducer,
    actions: uploadSlice.actions,
    thunks: {
        upload,
    }
}