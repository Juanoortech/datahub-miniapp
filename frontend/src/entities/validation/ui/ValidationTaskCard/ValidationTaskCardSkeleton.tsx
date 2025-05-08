import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {TextSkeleton} from "@/shared/ui/TextSkeleton"
import {ButtonIconSkeleton} from "@/shared/ui/ButtonIcon"

import styles from './ValidationTaskCard.module.scss'

export const ValidationTaskCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div className={clsx(className, styles.root)}>
        <div
            className={clsx(styles['image-wrapper'], styles.skeleton)}
        />
        <div className={styles.content}>
            <TextSkeleton
                className={clsx(styles.title, styles.skeleton)}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.5, 0.7]}
                view={'base'}
            />
            <div className={styles.bottom}>
                <TextSkeleton
                    className={clsx(styles.reward, styles.skeleton)}
                    fontSize={12}
                    lineHeight={16}
                    widthRange={[0.5, 0.7]}
                    view={'brand'}
                />
                <ButtonIconSkeleton />
            </div>
        </div>
    </div>
)