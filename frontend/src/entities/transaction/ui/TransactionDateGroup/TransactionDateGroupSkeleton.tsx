import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"

import {TransactionCardSkeleton} from "../TransactionCard"

import styles from './TransactionDateGroup.module.scss'

export const TransactionDateGroupSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            <div className={styles['date-badge']}/>
            {Array(3).fill(1).map((_, key) => (
                <>
                    <TransactionCardSkeleton />
                    {key < 2 && (
                        <div className={styles.divider} />
                    )}
                </>
            ))}
        </div>
    )
}