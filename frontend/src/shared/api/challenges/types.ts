import {ResponseDefault} from "@/shared/lib/api/createRequest";
import {ChallengeStatus, ChallengeType, TaskType} from "@/shared/api/enums";

export type GetActiveChallengesResponse = {
    items: {
        challenge: {
            id: number
            avatar: string
            title: string
            reward: number
            internal_type: ChallengeType
            button_text: string
            imitation_timer: string
            channel: {
                uri: string
            },
            redirect_link: string
        },
        status: ChallengeStatus,
    }[]
    page: number
    last_page: number
    total?: number
}

export type GetActiveChallengesParams = {
    page: number
}

export type GetCompletedChallengesResponse = {
    items: {
        challenge: {
            id: number
            avatar: string
            title: string
            reward: number
            internal_type: ChallengeType
            button_text: string
            imitation_timer: string
            channel: {
                uri: string
            },
            redirect_link: string
        },
        status: ChallengeStatus,
    }[]
    page: number
    last_page: number
    total?: number
}

export type GetCompletedChallengesParams = {
    page: number
}

export type GetChallengeInfoParams = {
    id: number
}

export type GetChallengeInfoResponse = {
    challenge: {
        id: number
        avatar: string
        title: string
        reward: number
        internal_type: TaskType
        button_text: string
        imitation_timer: string
        channel?: {
            uri: string
        }
        redirect_link: string
    },
    claimed: boolean
    can_be_claimed_in: string
}

export type StartChallengeParams = {
    id: number
}

export type StartChallengeResponse = {
    created: boolean
    claim_prize: 'claimed' | 'not claimed'
}

export type ClaimChallengeParams = {
    id: number
}

export type ClaimChallengeResponse = {
    created: boolean
    claim_prize: 'claimed' | 'not claimed'
}

export type ChallengesApi = {
    fetchActive: (params: GetActiveChallengesParams) =>
        Promise<ResponseDefault<GetActiveChallengesResponse>>
    fetchCompleted: (params: GetCompletedChallengesParams) =>
        Promise<ResponseDefault<GetCompletedChallengesResponse>>
    fetchInfo: (params: GetChallengeInfoParams) =>
        Promise<ResponseDefault<GetChallengeInfoResponse>>
    start: (params: StartChallengeParams) => Promise<ResponseDefault<StartChallengeResponse>>
    claim: (params: ClaimChallengeParams) => Promise<ResponseDefault<ClaimChallengeResponse>>
}