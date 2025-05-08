import {TaskState, TaskType} from "../enums"
import {ResponseDefault} from "@/shared/lib/api/createRequest"
import {CancelCompletion} from "@/shared/api/tasksHistory";

export type FetchActiveTasksResponse = {
    items: {
        id: number
        internal_type: TaskType
        title: string
        photo: string
        reward: number
        description: string
        text: string
        example: string
        time_to_complete: string
        limit_completions: number
        limit_file_size: number
        limit_video_length: number
        limit_audio_length: number
        validation_percent: number
    }[]
    page: number
    last_page: number
    total: number
}

const type = ['all', TaskType.AUDIO, TaskType.VIDEO, TaskType.IMAGE] as const

export type FetchActiveTasksParams = {
    type: (typeof type)[number][]
    page: number
}

export type FetchUncompletedTasksResponse = {
    items: {
        completion: {
            id: number
            task: {
                id: number
                title: string
                description: string
                photo: string
                reward: number
                internal_type: TaskType,
                time_to_complete: string
            }
            completion_date_and_time: string
            status: TaskState
        }
    }[]
}

export type CreateEmptyCompletionParams = {
    task_id: number
}

export type CreateEmptyCompletionResponse = {
    id: number
    task_id: number
}

export type FetchExpandTaskResponse = {
    id: number
    title: string
    internal_type: TaskType,
    photo: string
    reward: number
    description: string
    text: string
    audio_text: string | null
    example: string
    time_to_complete: string
    limit_completions: number
    limit_file_size: number
    limit_video_length: string
    limit_audio_length: string
    validation_percent: number
}

export type FetchExpandTaskParams = {
    task_id: number
}

export type UploadPhotoResponse = ResponseDefault<{
    status: boolean
    errorCode: number
}>

export type UploadPhotoParams = {
    id: number
    img: File
}

export type UploadVideoResponse = ResponseDefault<{
    status: boolean
    errorCode: number
}>

export type UploadVideoParams = {
    id: number
    video: File
}

export type UploadAudioParams = {
    id: number
    audio: File
}

export type UploadAudioResponse = ResponseDefault<{
    status: boolean
    errorCode: number
}>

export type UploadTaskFileParams = {
    file: File
    completionId: number | string
}

export type UploadTaskFileMiddleResponse = {
    presigned_url: string
    url: string
    file_uuid: string
}

export type ActiveTasksApi = {
    fetch: (params: FetchActiveTasksParams) =>
        Promise<ResponseDefault<FetchActiveTasksResponse>>
    fetchExpand: (params: FetchExpandTaskParams) =>
        Promise<ResponseDefault<FetchExpandTaskResponse>>
    fetchUncompletedTasks: () =>
        Promise<ResponseDefault<FetchUncompletedTasksResponse>>
    uploadPhotoResult: (params: UploadPhotoParams) => Promise<UploadPhotoResponse>
    uploadVideoResult: (params: UploadVideoParams) => Promise<UploadVideoResponse>
    uploadAudioResult: (params: UploadAudioParams) => Promise<UploadAudioResponse>
    createEmptyCompletion: (params: CreateEmptyCompletionParams) =>
        Promise<ResponseDefault<CreateEmptyCompletionResponse>>
    uploadTaskFile: (params: UploadTaskFileParams) => Promise<ResponseDefault<null>>
    cancel: (params: CancelCompletion) =>
        Promise<ResponseDefault<unknown>>
}