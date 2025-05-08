import React from "react"

import {PropsDefault} from "@/shared/lib/types"

import styles from './ReferralSystemList.module.scss'
import {clsx} from "clsx";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {Icon} from "@/shared/ui";

export const ReferralSystemListSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            {Array(5).fill(1).map((_, key) => (
                <div
                    key={key}
                    className={styles.item}
                >
                    <div
                        className={clsx(styles.row, styles.skeleton)}
                    >
                        <div
                            className={styles.avatar}
                        />
                        <TextSkeleton
                            className={styles.name}
                            fontSize={14}
                            lineHeight={20}
                            widthRange={[0.3, 0.5]}
                        />
                    </div>
                    <div
                        className={clsx(styles.row, styles.skeleton)}
                    >
                        <Icon
                            name={'coin'}
                            size={20}
                            view={'brand'}
                        />
                        <TextSkeleton
                            className={styles.balance}
                            fontSize={14}
                            lineHeight={16}
                            widthRange={[0.3, 0.5]}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}