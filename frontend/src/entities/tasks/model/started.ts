import { StartedTaskItem } from './types'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {activeTaskApi, FetchUncompletedTasksResponse} from "@/shared/api";
import {ResponseDefault} from "@/shared/lib/api/createRequest";
import {TimeStamp} from "@/shared/lib/types";
import {cancelTaskModel} from "@/features/tasks";
import {ISOtoTimeString} from "@/shared/lib/time";

const initialState: {
    startedTask: StartedTaskItem | null,
    isPending: boolean
} = {
    startedTask: null,
    isPending: false
}

const fetchStartedTask = createAsyncThunk(
    'entities/tasks/started',
    async () => {
        const response = await activeTaskApi.fetchUncompletedTasks()

        if (!response.error) {
            if (isCompletionActual(response.payload)) {
                return response
            }

            if (response.payload.items[0]) {
                await activeTaskApi.cancel({
                    completion_id: response.payload.items[0].completion.id,
                })
            }

            return {
                error: false,
                payload: {
                    items: []
                }
            } as ResponseDefault<FetchUncompletedTasksResponse>
        }

        return response
    },
)

const startedTasksSlice = createSlice({
    name: 'entities/startedTasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchStartedTask.pending, state => {
                state.isPending = true
            })
            .addCase(fetchStartedTask.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    console.log(payload)
                    state.startedTask = toDomain(payload)
                    console.log(toDomain(payload))
                    state.isPending = false
                }
            })
            .addCase(cancelTaskModel.thunks.cancelTask.fulfilled, state => {
                state.startedTask = null
            })
    }
})

export const startedTaskModel = {
    reducer: startedTasksSlice.reducer,
    actions: startedTasksSlice.actions,
    thunks: {
        fetchStartedTask,
    }
}
export * from './types'

const TIME_TO_CANCEL = 20 * 60000

function toDomain({ payload }: ResponseDefault<FetchUncompletedTasksResponse>): StartedTaskItem | null {
    function getTimer(start: string) {
        const now = new Date().getTime()
        const startDate = new Date(start).getTime()

        return TIME_TO_CANCEL - (now - startDate) as TimeStamp
    }

    console.log('!!payload!.items[0]', !!payload!.items[0])

    if (payload!.items[0]) {
        const data = payload!.items[0]

        return {
            completionId: data.completion.id,
            taskId: data.completion.task.id,
            type: data.completion.task.internal_type,
            title: data.completion.task.title,
            description: data.completion.task.description,
            award: data.completion.task.reward,
            time: ISOtoTimeString(data.completion.task.time_to_complete),
            date: new Date(data.completion.completion_date_and_time).getTime() as TimeStamp,
            state: data.completion.status,
            img: data.completion.task.photo,
            timer: getTimer(
                data.completion.completion_date_and_time
            )
        }
    }

    return null
}

function isCompletionActual(data: FetchUncompletedTasksResponse): boolean {
    if (data.items[0]) {
        const now = new Date().getTime()
        const startDate = new Date(data.items[0].completion.completion_date_and_time).getTime()

        return (now - startDate) < TIME_TO_CANCEL
    }

    return false
}