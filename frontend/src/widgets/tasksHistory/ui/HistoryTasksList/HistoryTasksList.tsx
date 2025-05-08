import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {AppDispatch, RootState} from '@/app/store'

import { HistoryTaskCard, HistoryTaskCardSkeleton } from '@/entities/history'

import { PropsDefault } from '@/shared/lib/types'
import { SkeletonWrapper } from '@/shared/ui/SkeletonWrapper'
import { TransitionFade } from '@/shared/ui/TransitionFade'
import { LazyImage } from '@/shared/ui/LazyImage/LazyImage'
import { images } from '@/shared/assets/images'

import styles from './HistoryTasksList.module.scss'
import { useScrollPaginateWithRef } from "@/shared/lib/hooks/useScrollPaginate";
import {tasksHistoryModel} from "@/entities/history/model";
import {Loader} from "@/shared/ui/Loader";
import {clsx} from "clsx";

export type HistoryTasksListProps = PropsDefault<{
    rootRef: React.RefObject<HTMLDivElement | null>
}>

export const HistoryTasksList: React.FC<HistoryTasksListProps> = ({
    rootRef,
    className,
}) =>  {
    const {
        list,
        state,
        type,
        isPaginating,
        isPending,
        hasNextPage,
        page
    } = useSelector((state: RootState) => state.historyTasks)
    const dispatch = useDispatch<AppDispatch>()

    const { onScroll } = useScrollPaginateWithRef({
        ref: rootRef,
        hasNextPage,
        page,
        isPaginating: isPaginating,
        fetchNextPage: params =>
            dispatch(tasksHistoryModel.thunks.fetchNextPage({
                page: params.page,
                state,
                type,
            }))
    })

    const classes = clsx(
        className,
        styles.root,
    )

    useEffect(() => {
        return () => {
            dispatch(tasksHistoryModel.actions.reset())
        }
    }, []);

    return (
        <TransitionFade
            className={classes}
            onScroll={onScroll}
        >
            {!isPending && list.length && (
                <div key={'notIsPending'}>
                    {list.map(item => (
                        <HistoryTaskCard 
                            key={item.id}
                            className={styles.item}
                            {...item}
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
                <div 
                    key={'Empty'}
                    className={styles.empty}    
                >
                    <LazyImage 
                        className={styles.image}
                        src={images.Empty.Notepad}
                        alt={'empty'}
                        skeletonMinHeight={160}
                    />
                    <p>You haven't completed any tasks yet.</p>
                </div>
            )}
            {isPending && (
                <SkeletonWrapper key={'isPending'}>
                    {Array(3).fill(1).map((_, key) => (
                        <HistoryTaskCardSkeleton 
                            key={key}
                            className={styles.item}
                        />
                    ))}
                </SkeletonWrapper>
            )}
        </TransitionFade>
    )
}