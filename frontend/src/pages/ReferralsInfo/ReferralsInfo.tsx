import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import { AppDispatch, RootState } from "@/app/store"

import { isEmptyViewer, viewerModel } from "@/entities/viewer"
import { totalListModel} from "@/entities/referrals";

import { useTelegram } from "@/shared/lib/hooks/useTelegram"

import { Content } from './Content'
import { Skeleton } from './Skeleton'
import {PageLayout} from "@/shared/ui/PageLayout";
import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";
import {useBackButton} from "@/shared/providers";

export const ReferralsInfo = () => {
    const {
        page,
        hasNextPage,
        isPendingReferrals,
        isPaginatingReferrals,
        isPendingViewer,
        isNeedFetchViewer,
    } = useSelector((state: RootState) => ({
        page: state.referralsTotal.page,
        hasNextPage: state.referralsTotal.hasNextPage,
        isPendingReferrals: state.referralsTotal.isPending,
        isPaginatingReferrals: state.referralsTotal.isPaginating,
        isPendingViewer: state.viewer.isPending,
        isNeedFetchViewer: isEmptyViewer(state.viewer.data)
    }))
    const dispatch = useDispatch<AppDispatch>()
    const { show } = useBackButton()

    const { setHeaderColor } = useTelegram()
    const { ref } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating: isPaginatingReferrals,
        fetchNextPage: params =>
            dispatch(totalListModel.thunks.fetchNextPage(params))
    })

    useEffect(() => {
        setHeaderColor('#f7f7f8')
        show()
        dispatch(totalListModel.thunks.fetch({
            page: 1
        }))
        if (isNeedFetchViewer) {
            dispatch(viewerModel.thunks.fetch())
        }
    }, [])

    return (
        <PageLayout
            rootRef={ref}
            isLoading={isPendingViewer || isPendingReferrals}
            Content={<Content />}
            Skeleton={<Skeleton />}
        />
    )
}