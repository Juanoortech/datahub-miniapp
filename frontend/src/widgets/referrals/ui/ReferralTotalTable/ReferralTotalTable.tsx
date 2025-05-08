import React from "react"
import {useSelector} from "react-redux"
import {clsx} from "clsx"

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"
import {toFormattedNumber} from "@/shared/lib/number"
import {toFormatedDate} from "@/shared/lib/time"

import styles from './ReferralTotalTable.module.scss'
import {TransitionFade} from "@/shared/ui/TransitionFade";
import {Loader} from "@/shared/ui/Loader";

export const ReferralTotalTable: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        balance,
        list,
        isPaginating
    } = useSelector((state: RootState) => ({
        balance: state.viewer.data.referralsBalance,
        list: state.referralsTotal.list,
        isPaginating: state.referralsTotal.isPaginating
    }))

    return (
        <div className={clsx(className, styles.root)}>
            <div className={styles.header}>
                <p className={styles.title}>Total Earned</p>
                <p className={styles.balance}>
                    {toFormattedNumber(balance)} <span> Pts</span>
                </p>
            </div>
            <div className={styles['table-wrapper']}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                    <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(item => (
                        <tr
                            key={item.id}
                            className={styles.row}
                        >
                            <td>{item.name}</td>
                            <td>{toFormatedDate(item.date)}</td>
                            <td>+{item.amount} Pts</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <TransitionFade className={styles.loader}>
                    {isPaginating && (
                        <Loader
                            color={'brand'}
                            size={'m'}
                        />
                    )}
                </TransitionFade>
            </div>
        </div>
    )
}