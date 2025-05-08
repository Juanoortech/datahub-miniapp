import React from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {TransactionDateGroup, TransactionDateGroupSkeleton} from "@/entities/transaction/ui";

import {PropsDefault} from "@/shared/lib/types"
import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";
import {transactionModel} from "@/entities/transaction";
import {TransitionFade} from "@/shared/ui/TransitionFade";

import styles from './TransactionGroupList.module.scss'
import {clsx} from "clsx";
import {Loader} from "@/shared/ui/Loader";
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";
import {EmptyResponse} from "@/shared/ui/EmptyResponse";

export const TransactionGroupList: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        pool,
        isPending,
        isPaginating,

        hasNextPage,
        page,

        transactionType,
        withdrawStatus,
        earningsType,
    } = useSelector((state: RootState) => state.transactions)

    const dispatch = useDispatch<AppDispatch>()

    const { ref, onScroll } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating,
        fetchNextPage: params =>
            dispatch(transactionModel.thunks.fetchNextPage({
                page: params.page,
                transactionType,
                withdrawStatus,
                earningType: earningsType,
            }))
    })

    return (
        <TransitionFade
            rootRef={ref}
            className={clsx(className, styles.root)}
            onScroll={onScroll}
        >
            {isPending && (
                <SkeletonWrapper key={'Skeleton'}>
                    {Array(3).fill(1).map((_, key) => (
                        <TransactionDateGroupSkeleton
                            key={key}
                            className={styles.item}
                        />
                    ))}
                </SkeletonWrapper>
            )}
            {!isPending && Object.values(pool).length && (
                <div key={'Content'}>
                    {Object.values(pool).map(item => (
                        <TransactionDateGroup
                            key={item.date}
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
            {!isPending && !Object.values(pool).length && (
                <EmptyResponse
                    key={'Empty'}
                    image={'Notepad'}
                    title={"You haven't earned any Points yet"}
                />
            )}
        </TransitionFade>
    )
}