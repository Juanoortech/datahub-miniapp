import React from "react"
import {useSelector} from "react-redux"
import {clsx} from "clsx"

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"
import {toFormattedNumber} from "@/shared/lib/number"

import styles from './TransactionBalance.module.scss'

export const TransactionBalance: React.FC<PropsDefault> = ({
    className
}) => {
    const { balance } = useSelector((state: RootState) => ({
        balance: state.viewer.data.balance
    }))

    return (
        <div className={clsx(className, styles.root)}>
            <p className={styles.title}>Balance</p>
            <p className={styles.balance}>{toFormattedNumber(balance)} <span>Pts</span></p>
        </div>
    )
}