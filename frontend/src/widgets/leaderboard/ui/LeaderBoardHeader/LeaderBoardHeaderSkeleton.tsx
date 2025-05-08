import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {ButtonSkeleton} from "@/shared/ui/Button/ButtonSkeleton";

import styles from './LeaderBoardHeader.module.scss'
import {TextSection} from "@/shared/ui/TextSection";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";

export const LeaderBoardHeaderSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div className={clsx(className, styles.root)}>
        <SkeletonWrapper className={styles.header}>
            <h1 className={styles.title}>Leaderboard</h1>
            <ButtonSkeleton
                className={styles['button-skeleton']}
                size={'s'}
            />
        </SkeletonWrapper>
        <SkeletonWrapper className={styles.content}>
            <div className={styles['avatar-wrapper']} />
            <div className={styles.body}>
                <div className={styles['row-between']}>
                    <TextSkeleton
                        fontSize={13}
                        lineHeight={20}
                        widthRange={[0.4, 0.7]}
                        view={'secondary'}
                    />
                </div>
                <div className={styles['row-between']}>
                    <TextSkeleton
                        fontSize={18}
                        lineHeight={22}
                        widthRange={[0.4, 0.7]}
                        view={'secondary'}
                    />
                    <TextSkeleton
                        fontSize={18}
                        lineHeight={22}
                        widthRange={[0.4, 0.7]}
                        view={'secondary'}
                    />
                </div>
            </div>
        </SkeletonWrapper>
    </div>
)