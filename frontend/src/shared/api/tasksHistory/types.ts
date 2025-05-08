import {ResponseDefault} from "@/shared/lib/api/createRequest"

import {HistoryElementType, TaskState} from "../enums"

export type GetTasksHistoryParams = {
    state: TaskState[]
    type: HistoryElementType[]
    page: number
}

export type GetTasksHistoryResponse = {
    items: {
        completion: {
            id: number
            task: {
                id: number
                title: string
                photo: string
                reward: number
            }
            status: TaskState
            completion_date_and_time: string
        }
        task_type: HistoryElementType
    }[]
    page: number
    last_page: number
    total: number
}

export type CancelCompletion = {
    completion_id: number
}

export type TasksHistoryApi = {
    fetch: (params: GetTasksHistoryParams) =>
        Promise<ResponseDefault<GetTasksHistoryResponse>>
}