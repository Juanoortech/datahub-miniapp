import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {TextSkeleton} from "@/shared/ui/TextSkeleton"

import styles from './ReferralTotalTable.module.scss'

export const ReferralTotalTableSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            <div className={styles.header}>
                <p className={styles.title}>Total Earned</p>
                <TextSkeleton
                    className={styles.balance}
                    fontSize={16}
                    lineHeight={20}
                    view={'base'}
                    widthRange={[0.4, 0.6]}
                />
            </div>
            <div
                className={clsx(styles['table-wrapper'], styles.skeleton)}
            />
        </div>
    )
}