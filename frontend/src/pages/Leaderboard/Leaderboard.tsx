import { Content } from './Content'
import { Skeleton } from './Skeleton'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store";
import {isEmptyViewer, viewerModel} from "@/entities/viewer";
import {useTelegram} from "@/shared/lib/hooks/useTelegram";
import {useScrollPaginate} from "@/shared/lib/hooks/useScrollPaginate";
import {leaderboardModel} from "@/entities/leaderboard";
import {useEffect} from "react";
import {TransitionFade} from "@/shared/ui/TransitionFade";

import styles from './Leaderboard.module.scss'
import {useBackButton} from "@/shared/providers";

export const Leaderboard = () => {
    const {
        page,
        hasNextPage,
        isPendingLeaderBoardViewerState,
        isPaginatingLeaderBoard,
        isPendingLeaderBoard,
        isPendingViewer,
        isNeedFetchViewer,
    } = useSelector((state: RootState) => ({
        page: state.leaderboard.page,
        hasNextPage: state.leaderboard.hasNextPage,
        isPendingLeaderBoard: state.leaderboard.isPending,
        isPendingLeaderBoardViewerState: state.leaderboard.isPendingViewerState,
        isPaginatingLeaderBoard: state.leaderboard.isPaginating,
        isPendingViewer: state.viewer.isPending,
        isNeedFetchViewer: isEmptyViewer(state.viewer.data)
    }))
    const dispatch = useDispatch<AppDispatch>()

    const { setHeaderColor } = useTelegram()
    const { hide } = useBackButton()
    const { ref } = useScrollPaginate({
        hasNextPage,
        page,
        isPaginating: isPaginatingLeaderBoard,
        fetchNextPage: params =>
            dispatch(leaderboardModel.thunks.fetchNextPage(params))
    })

    const isPending = isPendingLeaderBoard || isPendingViewer || isPendingLeaderBoardViewerState

    useEffect(() => {
        setHeaderColor('#03277e')
        hide()
        dispatch(leaderboardModel.thunks.fetch({
            page: 1
        }))
        dispatch(leaderboardModel.thunks.fetchViewerState())
        if (isNeedFetchViewer) {
            dispatch(viewerModel.thunks.fetch())
        }

        return () => {
            dispatch(leaderboardModel.actions.reset())
        }
    }, [])

    return (
        <div
            ref={ref}
            className={styles.root}
        >
            <TransitionFade>
                {!isPending && <Content key={'Content'} />}
                {isPending && <Skeleton key={'Skeleton'} />}
            </TransitionFade>
        </div>
    )
}