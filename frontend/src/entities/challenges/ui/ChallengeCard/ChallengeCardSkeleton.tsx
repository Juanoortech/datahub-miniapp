import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"

import styles from './ChallengeCard.module.scss'
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {Icon} from "@/shared/ui";

export const ChallengeCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.row}>
                <div
                    className={clsx(styles['avatar-wrapper'], styles.skeleton)}
                />
                <div>
                    <TextSkeleton
                        fontSize={14}
                        lineHeight={20}
                        widthRange={[0.5, 0.7]}
                    />
                    <TextSkeleton
                        className={styles.award}
                        fontSize={12}
                        lineHeight={16}
                        widthRange={[0.3, 0.5]}
                    />
                </div>
            </div>
            <Icon
                name={'chevron-right-outline'}
                size={24}
                view={'dark'}
            />
        </div>
    )
}