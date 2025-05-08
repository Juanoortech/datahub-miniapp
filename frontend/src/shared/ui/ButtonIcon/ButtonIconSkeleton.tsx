import { PropsDefault } from "@/shared/lib/types";

import { sizes, radius } from './model'
import styles from './ButtonIcon.module.scss'
import React from "react";

export type ButtonIconSkeletonProps = PropsDefault<{
    size?: (typeof sizes)[number]
    radius?: (typeof radius)[number]
}>

const ButtonIconSkeletonComponent: React.FC<ButtonIconSkeletonProps> = ({
    className,
    size = 'm',
    radius = 'm',
}) => {
    const classes = [
        className,
        styles.root,
        styles[`size_${size}`],
        styles[`radius_${radius}`],
        styles[`view_skeleton`],
    ].join(' ')

    return (
        <div 
            className={classes}
        />
    )
}

export const ButtonIconSkeleton = React.memo(ButtonIconSkeletonComponent)