import React from "react"

import {PropsDefault} from "@/shared/lib/types"
import {ChallengeStatus} from "@/shared/api/enums"

import {Challenge} from "../../model/types"

import {ChallengeCardBase} from './ChallengeCardBase'

export type ChallengeCardCompletedProps = PropsDefault<{
    challenge: Challenge,
    onClick: (v: Challenge) => void
}>

const ChallengeCardCompletedComponent: React.FC<ChallengeCardCompletedProps> = ({
    className,
    challenge,
    onClick
}) => {
    return (
        <ChallengeCardBase
            className={className}
            img={challenge.avatar}
            title={challenge.title}
            award={challenge.award}
            status={ChallengeStatus.CLAIMED}
            onClick={() => onClick(challenge)}
        />
    )
}

export const ChallengeCardCompleted = React.memo(ChallengeCardCompletedComponent)