import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import styles from './HistoryTaskCard.module.scss'
import { TextSkeleton } from "@/shared/ui/TextSkeleton";

export const HistoryTaskCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    const classes = [
        className ? className : '',
        styles.root,
    ].join(' ').trim()


    return (
        <div className={classes}>
            <div 
                className={styles['image-wrapper']}
            />
            <div className={styles.content}>
                <TextSkeleton 
                    view={'secondary'}
                    lineHeight={20}
                    fontSize={11}
                    widthRange={[0.5, 0.9]}
                />
                <div
                    className={styles.title}
                >
                    <TextSkeleton 
                        view={'base'}
                        lineHeight={20}
                        fontSize={14}
                        widthRange={[0.5, 0.9]}
                    />
                    <TextSkeleton 
                        view={'base'}
                        lineHeight={20}
                        fontSize={14}
                        widthRange={[0.5, 0.9]}
                    />
                </div>
            </div>
        </div>
    )
}