import React from "react"
import { clsx } from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {images} from "@/shared/assets/images";
import {TransitionFade} from "@/shared/ui/TransitionFade";

import styles from './PageLayout.module.scss'

export type PageLayoutProps = PropsDefault<{
    rootRef?: React.RefObject<HTMLDivElement>
    isLoading: boolean
    Content: React.ReactNode
    Skeleton: React.ReactNode
    onScroll?: () => void
}>

export const PageLayout = React.memo<PageLayoutProps>(({
    className,
    rootRef,
    isLoading,
    Content,
    Skeleton,
    onScroll
}) => {
    return (
        <div
            ref={rootRef}
            className={clsx(className, styles.root)}
            onScroll={onScroll}
        >
            <img
                className={styles.image}
                src={images.Decorations.PageBgDecoration}
                alt='page decoration'
            />
            <TransitionFade>
                {!isLoading && (
                    <div key={'Component'}>
                        {Content}
                    </div>
                )}
                {isLoading && (
                    <div key={'Skeleton'}>
                        {Skeleton}
                    </div>
                )}
            </TransitionFade>
        </div>
    )
})