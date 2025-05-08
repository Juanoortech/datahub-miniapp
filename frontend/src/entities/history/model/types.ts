import {HistoryElementType, TaskState} from "@/shared/api/enums"
import { TimeStamp } from "@/shared/lib/types"

export type HistoryTaskItem = {
    id: number
    award: number
    date: TimeStamp
    title: string
    state: TaskState
    img: string
    type: HistoryElementType
}