import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {
    ChallengeCardCompleted,
    ChallengeCardSkeleton,
    completedChallengesModel
} from "@/entities/challenges";
import {Challenge} from "@/entities/challenges/model/types"

import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";
import {TransitionFade} from "@/shared/ui/TransitionFade";
import {Loader} from "@/shared/ui/Loader";
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"
import {useModal} from "@/shared/ui/BottomSheet"
import { CompletedChallengeModal} from "@/features/challenges";
import {ChallengeStatus, ChallengeType} from "@/shared/api/enums"
import {EmptyResponse} from "@/shared/ui/EmptyResponse"

import styles from './CompletedChallengesList.module.scss'

export const CompletedChallengesList = () => {
    const {
        list,
        isPending,
        isPaginating,
        hasNextPage,
        page
    } = useSelector((state: RootState) => state.completedChallenges)
    const dispatch = useDispatch<AppDispatch>()

    const { ref, onScroll } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating: isPaginating,
        fetchNextPage: params =>
            dispatch(completedChallengesModel.thunks.fetchNextPage(params))
    })
    const { isOpen, open, close } = useModal()

    const [activeChallenge, setActiveChallenge] = useState<Challenge>({
        id: 0,
        avatar: '',
        actionText: '',
        award: 0,
        title: '',
        status: ChallengeStatus.CLAIMED,
        type: ChallengeType.IMITATION,
    })

    useEffect(() => {
        dispatch(completedChallengesModel.thunks.fetch({
            page: 1
        }))

        return () => {
            dispatch(completedChallengesModel.actions.reset())
        }
    }, []);

    return (
        <>
            <TransitionFade
                rootRef={ref}
                className={styles.root}
                onScroll={onScroll}
            >
                {!isPending && list.length && (
                    <div key={'Content'}>
                        {list.map(item => (
                            <ChallengeCardCompleted
                                key={item.id}
                                className={styles.item}
                                challenge={item}
                                onClick={() => {
                                    setActiveChallenge(item)
                                    open()
                                }}
                            />
                        ))}
                        <TransitionFade className={styles.loader}>
                            {isPaginating && (
                                <Loader
                                    color={'brand'}
                                    size={'m'}
                                />
                            )}
                        </TransitionFade>
                    </div>
                )}
                {!isPending && !list.length && (
                    <EmptyResponse
                        key={'Empty'}
                        image={'Notepad'}
                        title={'Complete challenges to earn Points'}
                    />
                )}
                {isPending && (
                    <SkeletonWrapper key={'Skeleton'}>
                        {Array(10).fill(1).map((_, key) => (
                            <ChallengeCardSkeleton
                                key={key}
                                className={styles.item}
                            />
                        ))}
                    </SkeletonWrapper>
                )}
            </TransitionFade>
            <CompletedChallengeModal
                isOpen={isOpen}
                challenge={activeChallenge}
                setIsOpen={close}
            />
        </>
    )
}