import React from "react"

import {PropsDefault} from "@/shared/lib/types"

import { Challenge } from "../../model/types"

import { ChallengeCardBase } from './ChallengeCardBase'

export type ChallengeCardActiveProps = PropsDefault<{
    challenge: Challenge,
    onClick: (v: Challenge) => void
}>

const ChallengeCardActiveComponent: React.FC<ChallengeCardActiveProps> = ({
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
            status={challenge.status}
            onClick={() => onClick(challenge)}
        />
    )
}

export const ChallengeCardActive = React.memo(ChallengeCardActiveComponent)