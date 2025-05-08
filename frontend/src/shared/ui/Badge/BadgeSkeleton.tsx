import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import { sizes } from './model'
import styles from './Badge.module.scss'

export type BadgeSkeletonProps = PropsDefault<{
    size?: (typeof sizes)[number]
}>

const BadgeSkeletonComponent: React.FC<BadgeSkeletonProps> = ({
    className,
    size = 'm',
}) => {
    const classes = [
        className ? className : '',
        styles.root,
        styles.skeleton,
        styles['view_skeleton'],
        styles[`size_${size}`]
    ].join(' ').trim()

    return (
        <div 
            className={classes}
        />
    )
}

export const BadgeSkeleton = React.memo(BadgeSkeletonComponent)