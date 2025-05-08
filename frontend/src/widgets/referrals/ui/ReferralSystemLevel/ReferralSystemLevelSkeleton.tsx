import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {TextSkeleton} from "@/shared/ui/TextSkeleton"

import styles from './ReferralSystemLevel.module.scss'

export const ReferralSystemLevelSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div className={clsx(className, styles.root)}>
        <div
            className={clsx(styles.image, styles.skeleton)}
        />
        <div className={styles.content}>
            <TextSkeleton
                className={styles.row}
                fontSize={13}
                lineHeight={20}
                widthRange={[0.5, 0.8]}
                view={'secondary'}
            />
            <div>
                <TextSkeleton
                    fontSize={12}
                    lineHeight={16}
                    widthRange={[0.5, 0.8]}
                    view={'brand'}
                />
                <TextSkeleton
                    fontSize={12}
                    lineHeight={16}
                    widthRange={[0.5, 0.8]}
                    view={'brand'}
                />
            </div>
        </div>
    </div>
)