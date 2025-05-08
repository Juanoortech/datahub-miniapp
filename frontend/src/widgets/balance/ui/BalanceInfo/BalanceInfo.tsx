import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {useNavigate} from "react-router-dom"

import { AppDispatch, RootState } from "@/app/store"

import {viewerModel} from "@/entities/viewer"

import {PropsDefault, RouterPathes} from "@/shared/lib/types"
import { TransitionFade } from "@/shared/ui/TransitionFade"
import {toFormattedNumber} from "@/shared/lib/number"
import {ButtonIcon} from "@/shared/ui/ButtonIcon"
import {TextSkeleton} from "@/shared/ui/TextSkeleton"

import styles from './BalanceInfo.module.scss'

export const BalanceInfo: React.FC<PropsDefault> = ({
    className
}) => {
    const navigate = useNavigate()

    const { isPending, data } = useSelector((state: RootState) => state.viewer)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(viewerModel.thunks.fetch())
    }, []);

    return (
        <TransitionFade className={className}>
            {!isPending && (
                <div className={styles.root}>
                    <div className={styles.content}>
                        <p className={styles.title}>Total Points Earned</p>
                        <p className={styles.value}>{toFormattedNumber(data.balance)}<span> Pts</span></p>
                    </div>
                    <ButtonIcon
                        icon={'chevron-right-outline'}
                        view={'surface'}
                        size={'m'}
                        onClick={() => {
                            navigate(RouterPathes.TRANSACTIONS)
                        }}
                    />
                </div>
            )}
            {isPending && (
                <div className={styles.root}>
                    <div className={styles.content}>
                        <p className={styles.title}>Total Points Earned</p>
                        <TextSkeleton
                            fontSize={36}
                            lineHeight={48}
                            widthRange={[0.5, 0.8]}
                        />
                    </div>
                    <ButtonIcon
                        icon={'chevron-right-outline'}
                        view={'surface'}
                        size={'m'}
                    />
                </div>
            )}
        </TransitionFade>
    )
}