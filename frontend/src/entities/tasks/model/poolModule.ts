import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ExpandTask} from './types'
import {activeTaskApi, FetchExpandTaskResponse} from '@/shared/api'
import {TaskType} from "@/shared/api/enums";
import {ISOtoTimeString} from "@/shared/lib/time";

const initialState: {
    pool: Record<ExpandTask['id'], ExpandTask>
    completionId: number | string
    isPending: boolean
    isContinue: boolean
} = {
    pool: {},
    completionId: '',
    isPending: true,
    isContinue: false
}

const fetchExpandTask = createAsyncThunk(
    'activeTask/fetchExpand',
    async ({
        id,
        completionId,
        pool
    }: {
        id: ExpandTask['id'],
        completionId: number | string
        pool: Record<ExpandTask['id'], ExpandTask>
    }) => {
        let compId = completionId

        // if (!compId) {
        //     const { payload } = await activeTaskApi.createEmptyCompletion({
        //         task_id: id
        //     })
        //
        //     compId = payload?.id
        // }

        if (id in pool) {
            return {
                error: false,
                isPool: true,
                completionId: compId,
                payload: pool[id]
            }
        }

        const response = await activeTaskApi.fetchExpand({
            task_id: id,
        })

        return {
            ...response,
            isPool: false,
            completionId: compId,
            payload: response.payload ? ({
                ...response.payload,
                id,
            }) : null
        }
    }
)

const createCompletion = createAsyncThunk(
    'activeTask/createCompletion',
    activeTaskApi.createEmptyCompletion,
)

const expandTasksSlice = createSlice({
    name: 'activeTasksPool',
    initialState,
    reducers: {
        setCompletionId: (state, { payload }: PayloadAction<number | string>) => {
            state.completionId = payload
            state.isContinue = true
        },
        reset: state => {
            state.isPending = true
            state.completionId = ''
            state.isContinue = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchExpandTask.pending, state => {
                state.isPending = true
            })
            .addCase(fetchExpandTask.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.completionId = payload.completionId
                    state.pool = {
                        ...state.pool,
                        [payload.payload!.id]: payload.isPool
                            ? payload.payload! as ExpandTask
                            : toDomain(payload.payload! as FetchExpandTaskResponse)
                    }
                    state.isPending = false
                }
            })
            .addCase(createCompletion.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.completionId = payload.payload.id
                }
            })
    }
})

export const expandTasksModel = {
    reducer: expandTasksSlice.reducer,
    actions: expandTasksSlice.actions,
    thunks: {
        fetchExpandTask,
        createCompletion
    }
}

function toDomain(data: FetchExpandTaskResponse): ExpandTask {
    function getDetails() {
        switch (data.internal_type) {
            case TaskType.IMAGE:
                return 'Please take a picture that looks similar to the example above.'
            case TaskType.VIDEO:
                return 'Please take a video that looks similar to the example above.'
            case TaskType.AUDIO:
                return 'Please record an audio that looks similar to the example above.'
        }
    }

    function getDuration() {
        switch (data.internal_type) {
            case TaskType.IMAGE:
                return undefined
            case TaskType.VIDEO:
                return ISOtoTimeString(data.limit_video_length)
            case TaskType.AUDIO:
                return ISOtoTimeString(data.limit_audio_length)
        }
    }

    return {
        id: data.id,
        title: data.title,
        img: data.photo,
        example: data.example,
        description: data.description,
        task: data.text,
        details: data.text,
        reward: data.reward,
        fileSize: data.limit_file_size,
        time: ISOtoTimeString(data.time_to_complete),
        duration: getDuration(),
        text: data.audio_text ? data.audio_text : undefined
    }
}