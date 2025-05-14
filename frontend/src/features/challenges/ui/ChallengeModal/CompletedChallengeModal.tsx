import React, {useCallback} from "react"

import {Challenge} from "@/entities/challenges/model/types"

import {ChallengeStatus, ChallengeType} from "@/shared/api/enums"

import {ChallengeModalBase} from './ChallengeModalBase'

export type CompletedChallengeModalProps = {
    isOpen: boolean
    challenge: Challenge
    setIsOpen: (isOpen: boolean) => void
}

export const CompletedChallengeModal: React.FC<CompletedChallengeModalProps> = ({
    isOpen,
    setIsOpen,
    challenge
}) => {
    const onClick = useCallback(() => {
        if (challenge.type === ChallengeType.IMITATION && challenge.link) {
            window.open(challenge.link, '_blank')
        } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
            window.open(`https://t.me/${challenge.channel.uri.replace('@', '')}`, '_blank')
        }
        setIsOpen(false)
    }, [challenge.channel, challenge.link, challenge.type, setIsOpen])

    return (
        <ChallengeModalBase
            status={ChallengeStatus.CLAIMED}
            title={challenge.title}
            award={challenge.award}
            buttonText={challenge.actionText}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClick={onClick}
        />
    )
}