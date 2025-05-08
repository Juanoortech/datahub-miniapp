import {TaskType} from "@/shared/api/enums";

export type ValidationListItem = {
    id: number
    type: TaskType
    title: string
    image: string
    reward: number
    available: number
}

export type ValidationExpand = {
    taskId: number
    completionId: number
    type: TaskType
    details: string
    data: string
    reward: number
}