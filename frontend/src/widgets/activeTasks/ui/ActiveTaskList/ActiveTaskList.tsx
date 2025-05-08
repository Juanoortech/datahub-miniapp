import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

import {AppDispatch, RootState} from "@/app/store"

import {ActiveTaskCard, ActiveTaskCardSkeleton, activeTasksModel, StartedTaskCard} from "@/entities/tasks"
import {ActiveTaskItem} from "@/entities/tasks/model/types"

import {PropsDefault, RouterPathes} from "@/shared/lib/types"
import {TransitionFade} from "@/shared/ui/TransitionFade"
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"
import {TaskType} from "@/shared/api/enums"
import {LazyImage} from "@/shared/ui/LazyImage/LazyImage"
import {images} from "@/shared/assets/images"
import { useScrollPaginateWithRef } from "@/shared/lib/hooks/useScrollPaginate";
import {Loader} from "@/shared/ui/Loader";

import { ModalHasActiveTask } from './ModalHasActiveTask'
import styles from './ActiveTaskList.module.scss'
import {useModal} from "@/shared/ui/BottomSheet";

export type ActiveTaskListProps = PropsDefault<{
    rootRef: React.RefObject<HTMLDivElement | null>
}>

export const ActiveTaskList: React.FC<ActiveTaskListProps> = ({
    rootRef,
    className
}) => {
    const navigate = useNavigate()

    const { 
        list,
        activeType,
        isPending,
        isPaginating,
        hasNextPage,
        page,
    } = useSelector((state: RootState) => state.activeTasks)
    const {
        startedTask,
        isPending: isStartedTasksLoading
    } = useSelector((state: RootState) => state.startedTasks)
    const dispatch = useDispatch<AppDispatch>()

    const { isOpen, open, close } = useModal()
    const { onScroll } = useScrollPaginateWithRef({
        ref: rootRef,
        hasNextPage,
        page,
        isPaginating: isPaginating,
        fetchNextPage: params =>
            dispatch(activeTasksModel.thunks.fetchNextPageTasks({
                page: params.page,
                type: activeType,
            }))
    })

    const classes = [
        className ? className : '',
        styles.root,
    ].join(' ').trim()

    function onClick(item: ActiveTaskItem) {
        if (!startedTask) {
            if (item.type === TaskType.IMAGE) {
                navigate(
                    RouterPathes.PHOTO_TASK.replace(':id', `${item.id}`)
                )
                return
            }
            if (item.type === TaskType.VIDEO) {
                navigate(
                    RouterPathes.VIDEO_TASK.replace(':id', `${item.id}`)
                )
                return
            }
            if (item.type === TaskType.AUDIO) {
                navigate(
                    RouterPathes.AUDIO_TASK.replace(':id', `${item.id}`)
                )
                return
            }
        } else {
            open()
        }
    }

    useEffect(() => {
        return () => {
            dispatch(activeTasksModel.actions.reset())
        }
    }, []);

    return (
        <>
            <TransitionFade
                className={classes}
                onScroll={onScroll}
            >
                {!isPending && !isStartedTasksLoading && (list.length || startedTask) && (
                    <div key={'Content'}>
                        {startedTask && (
                            <StartedTaskCard
                                className={styles.item}
                                {...startedTask}
                            />
                        )}
                        {list.map(item => (
                            <ActiveTaskCard
                                key={item.id}
                                className={styles.item}
                                {...item}
                                onClick={() => onClick(item)}
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
                {!isPending && !isStartedTasksLoading && !list.length && !startedTask && (
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
                        <p>There are no any tasks yet</p>
                    </div>
                )}
                {(isPending || isStartedTasksLoading) && (
                    <SkeletonWrapper key={'Skeleton'}>
                        {Array(3).fill(1).map((_, key) => (
                            <ActiveTaskCardSkeleton
                                key={key}
                                className={styles.item}
                            />
                        ))}
                    </SkeletonWrapper>
                )}
            </TransitionFade>
            <ModalHasActiveTask
                isOpen={isOpen}
                setIsOpen={close}
            />
        </>
    )
}