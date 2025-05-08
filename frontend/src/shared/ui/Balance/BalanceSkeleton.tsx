import React from "react"
import { clsx } from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper";
import {TextSkeleton} from "@/shared/ui/TextSkeleton";
import {ButtonIconSkeleton} from "@/shared/ui/ButtonIcon";

import styles from './Balance.module.scss'

export type BalanceSkeletonProps = PropsDefault<{
    label: string
}>

export const BalanceSkeleton: React.FC<BalanceSkeletonProps> = ({
    className,
    label,
}) => {
    return (
        <div className={clsx(className, styles.root)}>
            <p className={styles.subtitle}>{label}</p>
            <SkeletonWrapper className={styles.wrapper}>
                <TextSkeleton
                    view="base"
                    fontSize={36}
                    lineHeight={48}
                    widthRange={[0.5, 0.7]}
                />
                <ButtonIconSkeleton
                    size={'m'}
                />
            </SkeletonWrapper>
        </div>
    )
}