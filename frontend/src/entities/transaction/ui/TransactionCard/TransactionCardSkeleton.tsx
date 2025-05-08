import React from "react"

import {PropsDefault} from "@/shared/lib/types"

import styles from './TransactionCard.module.scss'
import {clsx} from "clsx";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {getRandomInt} from "@/shared/lib/number";

export const TransactionCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            <TextSkeleton
                view={'base'}
                className={clsx(styles.title, styles.skeleton)}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.5, 1]}
            />
            <TextSkeleton
                view={!!getRandomInt(0, 1) ? 'success' : 'critical'}
                className={clsx(styles.amount, styles.skeleton)}
                fontSize={13}
                lineHeight={20}
                widthRange={[0.5, 1]}
            />
        </div>
    )
}