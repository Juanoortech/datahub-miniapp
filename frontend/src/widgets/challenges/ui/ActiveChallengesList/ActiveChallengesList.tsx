import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {activeChallengesModel, ChallengeCardActive, ChallengeCardSkeleton} from "@/entities/challenges"

import {TransitionFade} from "@/shared/ui/TransitionFade"
import {Loader} from "@/shared/ui/Loader"
import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";

import styles from './ActiveChallengesList.module.scss'
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";
import {ActiveChallengeModal} from "@/features/challenges";
import {useModal} from "@/shared/ui/BottomSheet";
import {Challenge} from "@/entities/challenges/model/types";
import {ChallengeStatus, ChallengeType} from "@/shared/api/enums";
import {EmptyResponse} from "@/shared/ui/EmptyResponse";

export const ActiveChallengesList = () => {
    const {
        list,
        isPending,
        isPaginating,
        hasNextPage,
        page
    } = useSelector((state: RootState) => state.activeChallenges)
    const dispatch = useDispatch<AppDispatch>()

    const { ref, onScroll } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating: isPaginating,
        fetchNextPage: params =>
            dispatch(activeChallengesModel.thunks.fetchNextPage(params))
    })
    const { isOpen, open, close } = useModal()

    const [activeChallenge, setActiveChallenge] = useState<Challenge>({
        id: 0,
        avatar: '',
        actionText: '',
        award: 0,
        title: '',
        status: ChallengeStatus.NOT_STARTED,
        type: ChallengeType.IMITATION,
    })

    useEffect(() => {
        dispatch(activeChallengesModel.thunks.fetch({
            page: 1
        }))

        return () => {
            dispatch(activeChallengesModel.actions.reset())
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
                            <ChallengeCardActive
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
                        title={'There are no active challenges'}
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
            <ActiveChallengeModal
                isOpen={isOpen}
                challenge={activeChallenge!}
                setIsOpen={close}
            />
        </>
    )
}