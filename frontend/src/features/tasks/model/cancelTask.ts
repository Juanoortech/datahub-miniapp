import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {activeTaskApi} from "@/shared/api";
import {StartedTaskItem} from "@/entities/tasks";

const cancelTask = createAsyncThunk(
    'features/tasks/cancelTask',
    async (data: StartedTaskItem) => {
        const { error } = await activeTaskApi.cancel({ completion_id: data.completionId })

        return {
            error,
            payload: data,
        }
    }
)

const initialState: {
    isPending: boolean
    isSuccess: boolean
} = {
    isPending: false,
    isSuccess: false
}

const cancelTaskSlice = createSlice({
    name: 'feature/cancelTask',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = false
            state.isSuccess = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(cancelTask.pending, state => {
                state.isPending = true
            })
            .addCase(cancelTask.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.isPending = false
                    state.isSuccess = true
                }
            })
    }
})

export const cancelTaskModel = {
    reducer: cancelTaskSlice.reducer,
    actions: cancelTaskSlice.actions,
    thunks: {
        cancelTask,
    }
}