import { HistoryElementType, TaskState } from '@/shared/api/enums'
import { HistoryTaskItem } from './types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetTasksHistoryResponse, tasksHistoryApi } from '@/shared/api/tasksHistory'
import { ResponseDefault } from "@/shared/lib/api/createRequest";
import { TimeStamp } from "@/shared/lib/types";

const initialState: {
    state: TaskState[]
    type: HistoryElementType[]
    list: HistoryTaskItem[]
    page: number
    total?: number
    hasNextPage: boolean

    isPending: boolean
    isPaginating: boolean
} = {
    state: [],
    type: [],
    list: [],
    page: 1,
    total: 0,
    hasNextPage: false,

    isPending: true,
    isPaginating: false
}

const fetchHistory = createAsyncThunk(
    'history/fetchHistory',
    tasksHistoryApi.fetch,
)

const fetchNextPage = createAsyncThunk(
    'history/fetchNextPageTasks',
    tasksHistoryApi.fetch,
)

const tasksHistorySlice = createSlice({
    name: 'tasksHistory',
    initialState,
    reducers: {
        setState: (state, { payload }: PayloadAction<TaskState[]>) => {
            state.state = payload
        },
        setType: (state, { payload }: PayloadAction<HistoryElementType[]>) => {
          state.type = payload
        },
        reset: state => {
            state.isPending = true
        },
        resetFilters: state => {
            state.type = []
            state.state = []
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHistory.pending, state => {
                state.isPending = true
                state.isPaginating = false
            })
            .addCase(fetchHistory.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.list = toDomain(payload)
                    state.isPending = false
                    state.isPaginating = false
                    state.page = 1
                    state.hasNextPage = payload.payload.page < payload.payload.last_page
                    state.total = payload.payload.total ?? 0
                }
            })
            .addCase(fetchNextPage.pending, state => {
                state.isPaginating = true
            })
            .addCase(fetchNextPage.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.list = [
                        ...state.list,
                        ...toDomain(payload)
                    ]
                    state.isPending = false
                    state.isPaginating = false
                    state.page = payload.payload.page
                    state.hasNextPage = payload.payload.page < payload.payload.last_page
                    state.total = payload.payload.total ?? 0
                }
            })
    }
})

export const tasksHistoryModel = {
    reducer: tasksHistorySlice.reducer,
    actions: tasksHistorySlice.actions,
    thunks: {
        fetchHistory,
        fetchNextPage,
    }
}
export * from './types'

function toDomain(data: ResponseDefault<GetTasksHistoryResponse>): HistoryTaskItem[] {
    return data.payload!.items.map(item => ({
        id: item.completion.id,
        award: item.completion.task.reward,
        date: new Date(item.completion.completion_date_and_time).getTime() as TimeStamp,
        title: item.completion.task.title,
        img: item.completion.task.photo,
        state: item.completion.status,
        type: item.task_type,
    }))
}