import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppDispatch, RootState} from "@/app/store"

import {claimedAwardModel, startModel} from "@/features/challenges/model"

import {Challenge} from "@/entities/challenges/model/types"
import {challengesInfoModel} from "@/entities/challenges"

import {ChallengeStatus, ChallengeType} from "@/shared/api/enums"
import {useGlobalTrigger, useToaster} from "@/shared/providers"

import {ChallengeModalBase} from './ChallengeModalBase'

export type ActiveChallengeModalProps = {
    isOpen: boolean
    challenge: Challenge
    setIsOpen: (isOpen: boolean) => void
}

export const ActiveChallengeModal: React.FC<ActiveChallengeModalProps> = ({
    isOpen,
    setIsOpen,
    challenge
}) => {
    const {
        challengeInfo,
        isPending,
        isClaimPending,
        isStartPending,
        startState,
        claimAwardState,
    } = useSelector((state: RootState) => ({
        isPending: state.challengesInfo.isPending,
        challengeInfo: state.challengesInfo.challenge,
        isStartPending: state.startChallenge.state === 'pending',
        isClaimPending: state.claimChallengeAward.isPending,
        startState: state.startChallenge.state,
        claimAwardState: state.claimChallengeAward.state,
    }))
    const dispatch = useDispatch<AppDispatch>()

    const { trigger } = useGlobalTrigger()
    const { toast } = useToaster()

    const [isNotClaimed, setIsNotClaimed] = useState(false)
    const [isImitationEnded, setIsImitationEnded] = useState(false)

    const challengeData = useMemo(() => {
        function getStatus(status: ChallengeStatus) {
            if (status === ChallengeStatus.IN_PROGRESS && isImitationEnded) {
                return ChallengeStatus.NOT_CLAIMED
            }

            return status
        }

        if (!isPending && challengeInfo) {
            return {
                status: getStatus(challengeInfo.status),
                title: challengeInfo.title,
                award: challengeInfo.award,
                moderationTime: challengeInfo.moderationTime,
                buttonText: [
                    ChallengeStatus.NOT_CLAIMED,
                    ChallengeStatus.IN_PROGRESS
                ].includes(challengeInfo.status) && !isNotClaimed
                    ? 'Claim prize'
                    : challengeInfo.actionText,
            }
        } else {
            return {
                status: getStatus(challenge.status),
                title: challenge.title,
                award: challenge.award,
                moderationTime: challenge.moderationTime,
                buttonText: [
                    ChallengeStatus.NOT_CLAIMED,
                    ChallengeStatus.IN_PROGRESS
                ].includes(challenge.status) && !isNotClaimed
                    ? 'Claim prize'
                    : challenge.actionText,
            }
        }
    }, [isPending, challengeInfo, isImitationEnded, isNotClaimed, challenge.status, challenge.title, challenge.award, challenge.moderationTime, challenge.actionText])

    const onClick = useCallback(async () => {
        if (challengeData.status === ChallengeStatus.NOT_STARTED) {
            dispatch(startModel.thunks.start(challenge))
        }
        if (challengeData.status === ChallengeStatus.NOT_CLAIMED && !isNotClaimed) {
            dispatch(claimedAwardModel.thunks.claimAward(challenge))
        }
        if (challengeData.status === ChallengeStatus.CLAIMED || isNotClaimed) {
            if (challenge.type === ChallengeType.IMITATION && challenge.link) {
                window.open(challenge.link, '_blank')
            } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
                window.open(`https://t.me/${challenge.channel.uri.replace('@', '')}`, '_blank')
            }
            setIsOpen(false)
            setIsNotClaimed(false)
        }
    }, [challengeData.status, isNotClaimed, dispatch, challenge, setIsOpen])

    useEffect(() => {
        if (isOpen) {
            dispatch(challengesInfoModel.thunks.fetch(challenge))
        }
    }, [challenge, dispatch, isOpen])

    useEffect(() => {
        if (startState === 'success') {
            setTimeout(() => {
                setIsOpen(false)
                console.log('go via link')
                if (challenge.type === ChallengeType.IMITATION && challenge.link) {
                    window.open(challenge.link, '_blank')
                } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
                    window.open(`https://t.me/${challenge.channel.uri.replace('@', '')}`, '_blank')
                }
                dispatch(startModel.actions.reset())
            }, 100)
        } else if (startState === 'error') {
            trigger()
            dispatch(startModel.actions.reset())
        }
    }, [challenge.channel, challenge.link, challenge.type, dispatch, setIsOpen, startState, trigger]);

    useEffect(() => {
        console.log(claimAwardState)
        if (claimAwardState === 'success') {
            setIsOpen(false)
            toast({
                type: 'success',
                text: 'Challenge completed!',
            })
            dispatch(claimedAwardModel.actions.reset())
        } else if (claimAwardState === 'error') {
            toast({
                type: 'error',
                text: "You haven't completed the task yet."
            })
            dispatch(claimedAwardModel.actions.reset())
        } else if (claimAwardState === 'not claimed') {
            toast({
                type: 'error',
                text: "You haven't completed the task yet."
            })
            setIsNotClaimed(true)
            dispatch(claimedAwardModel.actions.reset())
        }
    }, [claimAwardState, dispatch, setIsOpen, toast]);

    return (
        <ChallengeModalBase
            {...challengeData}
            isOpen={isOpen}
            isLoading={isPending}
            isButtonLoading={isStartPending || isClaimPending}
            setIsOpen={setIsOpen}
            onClick={onClick}
            onTimerEnd={() => setIsImitationEnded(true)}
        />
    )
}