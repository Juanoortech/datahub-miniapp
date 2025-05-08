import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {activeTaskApi, FetchActiveTasksResponse} from "@/shared/api";
import {TaskType} from "@/shared/api/enums";
import {filtersState} from "@/shared/lib/store/filter";
import {ISOtoTimeString} from "@/shared/lib/time";

import {ActiveTaskItem, StartedTaskItem} from './types'
import {cancelTaskModel} from "@/features/tasks";

const type = ['all', TaskType.AUDIO, TaskType.VIDEO, TaskType.IMAGE] as const

const initialState: {
    activeType: (typeof type)[number][]
    list: ActiveTaskItem[]
    page: number
    total?: number
    hasNextPage: boolean

    isPending: boolean
    isPaginating: boolean
} = {
    activeType: ['all'],
    list: [],
    page: 1,
    total: 0,
    hasNextPage: false,
    isPending: true,
    isPaginating: false
}

const fetchTasks = createAsyncThunk(
    'activeTask/fetchTasks',
    activeTaskApi.fetch,
)

const fetchNextPageTasks = createAsyncThunk(
    'activeTask/fetchNextPageTasks',
    activeTaskApi.fetch,
)

const activeTasksSlice = createSlice({
    name: 'activeTask',
    initialState,
    reducers: {
        setActiveType: (state, { payload }: PayloadAction<'all' | TaskType>) => {
            state.activeType = filtersState(
                state.activeType,
                payload,
                3,
                'all'
            )
        },
        reset: state => {
            state.isPending = true
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.pending, state => {
                state.isPending = true
                state.isPaginating = false
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                if (!action.payload.error) {
                    state.list = toDomain(action.payload.payload)
                    state.isPending = false
                    state.isPaginating = false
                    state.page = 1
                    state.hasNextPage = hasNextPage(action.payload.payload)
                    state.total = action.payload.payload.total ?? 0
                }
            })
            .addCase(fetchNextPageTasks.pending, state => {
                state.isPaginating = true
            })
            .addCase(fetchNextPageTasks.fulfilled, (state, action) => {
                if (!action.payload.error) {
                    state.list = [
                        ...state.list,
                        ...toDomain(action.payload.payload)
                    ]
                    state.isPending = false
                    state.isPaginating = false
                    state.page = action.payload.payload.page
                    state.hasNextPage = hasNextPage(action.payload.payload)
                    state.total = action.payload.payload.total ?? 0
                }
            })
            .addCase(cancelTaskModel.thunks.cancelTask.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.list = [
                        startedToDomain(payload.payload),
                        ...state.list,
                    ]
                }
            })
    }
})

export const activeTasksModel = {
    reducer: activeTasksSlice.reducer,
    actions: activeTasksSlice.actions,
    thunks: {
        fetchTasks,
        fetchNextPageTasks,
    }
}
export * from './lib'
export * from './poolModule'
export * from './started'
export * from './types'

function toDomain(data: FetchActiveTasksResponse): ActiveTaskItem[] {
    return data.items.map(item => ({
        id: item.id,
        type: item.internal_type,
        img: item.photo,
        title: item.title,
        description: item.description,
        price: item.reward,
        time: ISOtoTimeString(item.time_to_complete),
    }))
}

function startedToDomain(data: StartedTaskItem): ActiveTaskItem {
    return {
        id: data.taskId,
        type: data.type,
        img: data.img,
        title: data.title,
        description: data.description,
        price: data.award,
        time: data.time,
    }
}

function hasNextPage(data: FetchActiveTasksResponse): boolean {
    return data.page < data.last_page
}