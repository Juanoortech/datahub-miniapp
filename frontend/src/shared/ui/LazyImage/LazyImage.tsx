import React, { useEffect, useState } from "react";

import { PropsDefault } from "@/shared/lib/types";

import { TransitionFade } from "../TransitionFade";
import { SkeletonWrapper } from "../SkeletonWrapper";

import styles from './LazyImage.module.scss'

export type LazyImageProps = PropsDefault<{
    src: string
    alt: string
    skeletonMinHeight: number
}>

export const LazyImage: React.FC<LazyImageProps> = ({
    className,
    src,
    alt,
    skeletonMinHeight,
}) => {
    const [isLoading, setIsLoading] = useState(true)

    const classes = [
        className ? className : '',
    ].join(' ').trim()

    useEffect(() => {
        const image = new Image()
        image.src = src
        image.onload = () => {
            setIsLoading(false)
        }
    }, [src])

    return (
        <div className={classes}>
            <TransitionFade className={styles.wrapper}>
                {isLoading && (
                    <SkeletonWrapper className={styles.wrapper}>
                        <div
                            className={styles.skeleton} 
                            style={{
                                minHeight: `${skeletonMinHeight}px`,
                            }}
                        />
                    </SkeletonWrapper>
                )}
                {!isLoading && (
                    <img 
                        className={styles.image}
                        src={src}
                        alt={alt}
                        loading="lazy"
                    />
                )}
            </TransitionFade>
        </div>
    )
}