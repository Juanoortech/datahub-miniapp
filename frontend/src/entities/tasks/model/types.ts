import {TaskDifficult, TaskState, TaskType} from "@/shared/api/enums"
import { TimeStamp } from "@/shared/lib/types"

export type ActiveTaskItem = {
    id: number
    type: TaskType
    img: string
    title: string
    description: string
    price: number
    time: TimeStamp
    duration?: TimeStamp
}

export type ExpandTask = {
    id: number
    title: string
    img: string
    example: string
    description: string
    task: string
    details: string
    reward: number
    fileSize: number
    time: TimeStamp
    duration?: TimeStamp
    text?: string
}

export type StartedTaskItem = {
    completionId: number
    taskId: number
    type: TaskType
    img: string
    title: string
    description: string
    award: number
    time: TimeStamp
    date: TimeStamp
    timer: TimeStamp
    state: TaskState
}