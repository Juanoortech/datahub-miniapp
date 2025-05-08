import React from "react";

import { PropsDefault } from "@/shared/lib/types";
import { getRandomDecimal } from "@/shared/lib/number";

import { views } from './model'
import styles from './TextSkeleton.module.scss'

export type TextSkeletonProps = PropsDefault<{
    fontSize: number,
    lineHeight: number
    view?: (typeof views)[number]
    widthRange: [number, number]
}>

const TextSkeletonComponent: React.FC<TextSkeletonProps> = ({
    className,
    fontSize,
    lineHeight,
    view = 'base',
    widthRange,
}) => {
    const classes = [
        className ? className : '',
        styles.root,
    ].join(' ').trim()

    const innerClasses = [
        styles.inner,
        styles[`view_${view}`]
    ].join(' ').trim()

    return (
        <div
            className={classes}
            style={{
                height: lineHeight
            }}
        >
            <div 
                className={innerClasses}
                style={{
                    height: fontSize,
                    width: `${getRandomDecimal(widthRange[0], widthRange[1]) * 100}%`
                }}
            />
        </div>
    )
}

export const TextSkeleton = React.memo(TextSkeletonComponent)