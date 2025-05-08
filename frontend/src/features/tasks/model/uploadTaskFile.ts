import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {activeTaskApi} from "@/shared/api";

const uploadTaskFile = createAsyncThunk(
    "features/tasks/uploadTaskFile",
    activeTaskApi.uploadTaskFile,
)

const initialState: {
    isPending: boolean
    isSuccess: boolean
    isError: boolean
} = {
    isError: false,
    isSuccess: false,
    isPending: false
}

const uploadTaskFileSlice = createSlice({
    name: 'features/tasks/uploadTaskFile',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = false
            state.isSuccess = false
            state.isError = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(uploadTaskFile.pending, state => {
                state.isPending = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(uploadTaskFile.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.isPending = false
                    state.isSuccess = true
                } else {
                    state.isError = true
                }
            })
    }
})

export const uploadTaskFileModel = {
    reducer: uploadTaskFileSlice.reducer,
    actions: uploadTaskFileSlice.actions,
    thunks: {
        uploadTaskFile
    }
}