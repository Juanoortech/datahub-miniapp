import React, {useCallback, useEffect, useRef} from "react";

export const useScrollPaginate = ({
    hasNextPage,
    page,
    isPaginating,
    fetchNextPage
}: {
    hasNextPage: boolean
    page: number
    isPaginating: boolean
    fetchNextPage: (params: {
        page: number
    }) => void
}) => {
    const ref = useRef<HTMLDivElement | null>(null)

    const { onScroll } = useScrollPaginateWithRef({
        ref,
        hasNextPage,
        isPaginating,
        page,
        fetchNextPage,
    })

    return {
        ref,
        onScroll,
    }
}

export const useScrollPaginateWithRef = ({
    ref,
    hasNextPage,
    page,
    isPaginating,
    fetchNextPage
}: {
    ref: React.RefObject<HTMLDivElement | null>
    hasNextPage: boolean
    page: number
    isPaginating: boolean
    fetchNextPage: (params: {
        page: number
    }) => void
}) => {
    const onScroll = useCallback(() => {
        const element = ref.current!

        const scrollTop = element.scrollTop
        const clientHeight = element.clientHeight
        const scrollHeight = element.scrollHeight

        if (scrollTop + clientHeight + 10 > scrollHeight && !isPaginating) {
            if (hasNextPage) {
                fetchNextPage({
                    page: page + 1
                })
            }
        }
    }, [ref, isPaginating, hasNextPage, fetchNextPage, page])

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener(
                'scroll',
                onScroll,
            )
        }

        return () => {
            ref.current?.removeEventListener(
                'scroll',
                onScroll,
            )
        }
    }, [onScroll, ref])

    return {
        onScroll,
    }
}