import { TasksHistoryApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";
import {queryParams} from "@/shared/lib/api/queryParams";
import {TaskState} from "@/shared/api/enums";

export const tasksHistoryApi: TasksHistoryApi = {
    fetch: ({ state, type, page }) =>
        createRequest({
            url: `tasks/completions/${queryParams({
                page,
                status: state.length === 0 
                    ? [TaskState.REVIEW, TaskState.ACCEPTED, TaskState.DECLINED].join(',')
                    : state.join(','),
                task_type: type.length === 0 || type.length === 2
                    ? undefined
                    : type[0]
            })}`,
            method: 'GET',
        })
}