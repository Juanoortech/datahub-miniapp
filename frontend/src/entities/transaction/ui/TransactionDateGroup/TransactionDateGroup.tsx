import React from "react"
import {clsx} from "clsx"

import {PropsDefault, TimeStamp} from "@/shared/lib/types"
import {isToday, isYesterday, toFormatedDate} from "@/shared/lib/time"

import { TransactionGroup } from '../../model'

import {TransactionCard} from "../TransactionCard"

import styles from './TransactionDateGroup.module.scss'

export type TransactionDateGroupProps = PropsDefault<TransactionGroup>

const TransactionDateGroupComponent: React.FC<TransactionDateGroupProps> = ({
    className,
    date,
    items,
}) => {
    function getBadgeText(date: TimeStamp) {
        if (isToday(date)) {
            return 'Today'
        }
        if (isYesterday(date)) {
            return 'Yesterday'
        }

        return toFormatedDate(date)
    }

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles['date-badge']}>
                {getBadgeText(date)}
            </div>
            {items.map((item, key) => (
                <>
                    <TransactionCard
                        {...item}
                    />
                    {key < items.length - 1 && (
                        <div className={styles.divider} />
                    )}
                </>
            ))}
        </div>
    )
}

export const TransactionDateGroup = React.memo(TransactionDateGroupComponent)