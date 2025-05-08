import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {ValidationListItem, validationListModel} from "@/entities/validation"

import {TransitionFade} from "@/shared/ui/TransitionFade"
import { useScrollPaginateWithRef } from "@/shared/lib/hooks/useScrollPaginate"

import styles from './ValidationTasksList.module.scss'
import {ValidationTaskCard, ValidationTaskCardSkeleton} from "@/entities/validation/ui/ValidationTaskCard";
import {Loader} from "@/shared/ui/Loader";
import React, {useEffect} from "react";
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";
import {useNavigate} from "react-router-dom";
import {PropsDefault, RouterPathes} from "@/shared/lib/types";
import {LazyImage} from "@/shared/ui/LazyImage";
import {images} from "@/shared/assets/images";

export type ValidationTasksListProps = PropsDefault<{
    rootRef: React.RefObject<HTMLDivElement | null>
}>

export const ValidationTasksList: React.FC<ValidationTasksListProps> = ({
    rootRef
}) => {
    const navigate = useNavigate()

    const {
        list,
        activeType,
        isPending,
        isPaginating,
        hasNextPage,
        page
    } = useSelector((state: RootState) => state.validation)
    const dispatch = useDispatch<AppDispatch>()

    const { onScroll } = useScrollPaginateWithRef({
        ref: rootRef,
        hasNextPage,
        page,
        isPaginating: isPaginating,
        fetchNextPage: params =>
            dispatch(validationListModel.thunks.fetchNextPage({
                page: params.page,
                type: activeType
            }))
    })

    function onClick({ id }: ValidationListItem) {
        navigate(RouterPathes.VALIDATION.replace(':id', `${id}`))
    }

    useEffect(() => {
        return () => {
            dispatch(validationListModel.actions.reset())
        }
    }, []);

    return (
        <TransitionFade
            className={styles.root}
            onScroll={onScroll}
        >
            {!isPending && list.length && (
                <div key={'Content'}>
                    {list.map(item => (
                        <ValidationTaskCard
                            key={item.id}
                            className={styles.item}
                            task={item}
                            onClick={onClick}
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
                    <p>There are no any validations yet</p>
                </div>
            )}
            {isPending && (
                <SkeletonWrapper key={'Skeleton'}>
                    {Array(5).fill(1).map((_, key) => (
                        <ValidationTaskCardSkeleton
                            key={key}
                            className={styles.item}
                        />
                    ))}
                </SkeletonWrapper>
            )}
        </TransitionFade>
    )
}