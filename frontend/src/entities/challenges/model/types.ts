import {TimeStamp} from "@/shared/lib/types"
import {ChallengeStatus, ChallengeType} from "@/shared/api/enums"

export type Challenge = {
    id: number
    avatar: string
    title: string
    award: number
    type: ChallengeType
    status: ChallengeStatus
    actionText: string
    moderationTime?: TimeStamp
    link?: string
    channel?: {
        uri: string
    },
}