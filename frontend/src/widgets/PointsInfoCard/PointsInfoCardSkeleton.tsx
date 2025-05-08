import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"

import styles from './PointsInfoCard.module.scss'
import {Icon} from "@/shared/ui";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";

export const PointsInfoCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            <Icon
                name={'diamond'}
                size={24}
                view={'brand'}
            />
            <div className={styles.content}>
                <TextSkeleton
                    className={styles.title}
                    fontSize={14}
                    lineHeight={20}
                    widthRange={[0.5, 0.8]}
                />
                <TextSkeleton
                    className={styles.description}
                    fontSize={12}
                    lineHeight={16}
                    widthRange={[0.5, 0.8]}
                    view={'secondary'}
                />
            </div>
        </div>
    )
}