import React from "react"

import {PropsDefault} from "@/shared/lib/types"

import styles from './LeaderboardList.module.scss'
import {clsx} from "clsx";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";

export const LeaderboardListSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <SkeletonWrapper className={clsx(styles.root, className)}>
        {Array(15).fill(1).map((item, key) => (
            <>
                <div
                    key={item.id}
                    className={styles.item}
                >
                    <TextSkeleton
                        fontSize={13}
                        lineHeight={20}
                        widthRange={[0.3, 0.5]}
                        view={'secondary'}
                    />
                    <TextSkeleton
                        fontSize={16}
                        lineHeight={20}
                        widthRange={[0.3, 0.5]}
                        view={'secondary'}
                    />
                </div>
                {key !== 14 && (
                    <div className={styles.divider} />
                )}
            </>
        ))}
    </SkeletonWrapper>
)