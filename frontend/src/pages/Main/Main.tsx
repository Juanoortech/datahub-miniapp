import {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '@/app/store'

import { BalanceInfo } from '@/widgets/balance'
import { ActiveTaskList } from '@/widgets/activeTasks'
import { HistoryTasksList } from '@/widgets/tasksHistory'
import {ValidationTasksList} from "@/widgets/validation"
import {WalletStatus} from "@/widgets/WalletStatus"
import {PointsInfoCard} from "@/widgets/PointsInfoCard"

import { ActiveTaskFilter } from '@/features/tasks'
import { HistoryTaskFilter } from '@/features/tasks/HistoryTaskFilter'
import {ValidationFilter} from "@/features/validation"

import { images } from '@/shared/assets/images'
import { useTelegram } from '@/shared/lib/hooks/useTelegram'
import { TabsCardLayout } from '@/shared/ui/TabsCardLayout'
import { RouterPathes } from '@/shared/lib/types'
import {useBackButton} from "@/shared/providers"

import styles from './Main.module.scss'
import { mainModel } from "./model"

export const Main = () => {
    const navigate = useNavigate()

    const {
        data,
        state,
    } = useSelector((state: RootState) => ({
        data: state.viewer.data,
        state: state.mainPage.state,
    }))
    const dispatch = useDispatch()

    const { setHeaderColor } = useTelegram()
    const { hide } = useBackButton()

    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setHeaderColor('#f7f7f8')
        hide()
    }, [])

    useEffect(() => {
        if (data.isFirstUse) {
            navigate(RouterPathes.ON_BOARDING)
        }
    }, [data])

    return (
        <div
            ref={ref}
            className={styles.root}
        >
            <img 
                className={styles.image}
                src={images.Decorations.PageBgDecoration}
                alt='page decoration'
            />
            <WalletStatus />
            <BalanceInfo />
            <PointsInfoCard />
            <TabsCardLayout
                state={state}
                setState={v => dispatch(mainModel.actions.setState(v))}
                isScrollable={false}
                tabs={['Active Tasks', 'Validation', 'History']}
                components={[
                    <>
                        <ActiveTaskFilter />
                        <ActiveTaskList
                            rootRef={ref}
                        />
                    </>,
                    <>
                        <ValidationFilter />
                        <ValidationTasksList
                            rootRef={ref}
                        />
                    </>,
                    <>
                        <HistoryTaskFilter />
                        <HistoryTasksList
                            rootRef={ref}
                        />
                    </>
                ]}
            />
        </div>
    )
}
