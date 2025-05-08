import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {isEmptyViewer, viewerModel} from "@/entities/viewer";
import {referralsModel} from "@/entities/referrals";

import { useTelegram } from "@/shared/lib/hooks/useTelegram";
import {PageLayout} from "@/shared/ui/PageLayout";

import { Content } from './Content'
import { Skeleton } from './Skeleton'
import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";
import {useBackButton} from "@/shared/providers";

export const Referrals = () => {
    const {
        page,
        hasNextPage,
        isPendingReferrals,
        isPaginatingReferrals,
        isPendingViewer,
        isNeedFetchViewer,
    } = useSelector((state: RootState) => ({
        page: state.referrals.page,
        hasNextPage: state.referrals.hasNextPage,
        isPendingReferrals: state.referrals.isPending,
        isPaginatingReferrals: state.referrals.isPaginating,
        isPendingViewer: state.viewer.isPending,
        isNeedFetchViewer: isEmptyViewer(state.viewer.data)
    }))
    const dispatch = useDispatch<AppDispatch>()

    const { setHeaderColor } = useTelegram()
    const { ref } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating: isPaginatingReferrals,
        fetchNextPage: params =>
            dispatch(referralsModel.thunks.fetchNextPage(params))
    })
    const { hide } = useBackButton()

    useEffect(() => {
        setHeaderColor('#f7f7f8')
        hide()
        dispatch(referralsModel.thunks.fetch({
            page: 1
        }))
        if (isNeedFetchViewer) {
            dispatch(viewerModel.thunks.fetch())
        }

        return () => {
            dispatch(referralsModel.actions.reset())
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