import {TaskType} from "@/shared/api/enums";
import {ResponseDefault} from "@/shared/lib/api/createRequest";

export type FetchValidationsListResponse = {
    items: {
        task: {
            id: number
            title: string
            internal_type: TaskType
            photo: string
            reward: number
            description: string
            text: string
            audio_text: string | null
            example: string
        },
        available: number
    }[]
    page: number
    last_page: number
    total: number
}

export type FetchValidationsListParams = {
    type: TaskType[]
    page: number
}

export type FetchValidationExpandResponse = {
    id: number
    task: {
        id: number
        title: string
        internal_type: TaskType
        photo: string
        reward: number
        description: string
        text: string
        audio_text: string | null
        example: string
    }
    file: {
        url: string
    }
}

export type FetchValidationExpandParams = {
    id: number
}

export type SendValidationResultParams = {
    id: number
    rate: number
}

export type ValidationApi = {
    fetch: (params: FetchValidationsListParams) =>
        Promise<ResponseDefault<FetchValidationsListResponse>>
    fetchExpand: (params: FetchValidationExpandParams) =>
        Promise<ResponseDefault<FetchValidationExpandResponse>>
    sendResult: (params: SendValidationResultParams) =>
        Promise<ResponseDefault<unknown>>
}