import React from 'react'
import { Virtuoso } from 'react-virtuoso'

import { TransitionFade } from "@/shared/ui/TransitionFade"
import { Loader } from "@/shared/ui/Loader"

import styles from './FlatList.module.scss'

export type FlatListProps<T> = {
    list: T[]

    renderItem: (
        item: T,
        index: number
    ) => React.ReactElement
    renderSkeleton?: (
        index: number
    ) => React.ReactElement

    spacing?: number

    skeletonsCount?: number
    isLoading?: boolean

    fetchNextPage?: () => Promise<unknown>
    isFetching?: boolean
    isNextPage?: boolean
}

const FlatListComponent: React.FC<FlatListProps<any>> = ({
    list,

    renderItem,
    renderSkeleton,

    spacing,

    skeletonsCount = 3,
    isLoading,

    fetchNextPage,
    isFetching,
    isNextPage = true,
}) => {
    const paginatingLoadingRender = () => (
        <TransitionFade className={styles.loader}>
            {isFetching && (
                <Loader
                    color={'brand'}
                    size={'m'}
                />
            )}
        </TransitionFade>
    )

    const contentRender = () => (
        <Virtuoso
            useWindowScroll={true}

            totalCount={list.length}
            itemContent={(index) => (
                <div style={
                    index < list.length - 1
                        ? {
                            paddingBottom: `${spacing}px`
                        }
                        : undefined
                }>
                    {renderItem(
                        list[index],
                        index
                    )}
                </div>
            )}

            components={{
                Footer: paginatingLoadingRender,
            }}

            endReached={() => {
                if (isNextPage) {
                    fetchNextPage?.()
                }
            }}
        />
    )

    const skeletonRender = () => (
        <Virtuoso
            useWindowScroll={true}

            totalCount={skeletonsCount}
            itemContent={(index) => (
                <div style={
                    index < list.length - 1
                        ? {
                            paddingBottom: `${spacing}px`
                        }
                        : undefined
                }>
                    {renderSkeleton?.(
                        index
                    )}
                </div>
            )}
        />
    )

    if (renderSkeleton) {
        return (
            <TransitionFade>
                {isLoading
                    ? (
                        <div key={'Skeleton'}>
                            {skeletonRender()}
                        </div>
                    )
                    : (
                        <div key={'Content'}>
                            {contentRender()}
                        </div>
                    )
                }
            </TransitionFade>
        )
    }

    return contentRender()
}

export const FlatList = React.memo(FlatListComponent)
