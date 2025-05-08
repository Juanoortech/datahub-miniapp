import React from "react"

import { PropsDefault } from "@/shared/lib/types"

import styles from './ActiveTaskCard.module.scss'
import { BadgeSkeleton } from "@/shared/ui/Badge"
import { TextSkeleton } from "@/shared/ui/TextSkeleton"
import { ButtonIconSkeleton } from "@/shared/ui/ButtonIcon/ButtonIconSkeleton"

export const ActiveTaskCardSkeleton: React.FC<PropsDefault> = ({
    className
}) => {
    const classes = [
        className ? className : '',
        styles.root
    ].join(' ').trim()

    return (
        <div className={classes}>
            <div className={styles['image-wrapper']}>
                <BadgeSkeleton 
                    className={styles.type}
                    size={'l'}
                />
                <div 
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <div className={styles['header-wrapper']}>
                    <TextSkeleton 
                        lineHeight={24}
                        fontSize={18}
                        view={'base'}
                        widthRange={[0.4, 0.7]}
                    />
                    <BadgeSkeleton 
                        size="s"
                    />
                </div>
                <div className={styles.description}>
                    <TextSkeleton 
                        lineHeight={20}
                        fontSize={13}
                        view={'secondary'}
                        widthRange={[0.4, 0.9]}
                    />
                    <TextSkeleton 
                        lineHeight={20}
                        fontSize={13}
                        view={'secondary'}
                        widthRange={[0.4, 0.9]}
                    />
                    <TextSkeleton 
                        lineHeight={20}
                        fontSize={13}
                        view={'secondary'}
                        widthRange={[0.4, 0.9]}
                    />
                </div>
                <div className={styles.bottom}>
                    <div className={styles.inner}>
                        <TextSkeleton 
                            view={'brand'}
                            fontSize={12}
                            lineHeight={16}
                            widthRange={[0.2, 0.4]}
                        />
                        <div 
                            className={styles.divider}
                        />
                        <TextSkeleton 
                            view={'secondary'}
                            fontSize={12}
                            lineHeight={16}
                            widthRange={[0.2, 0.4]}
                        />
                    </div>
                    <ButtonIconSkeleton 
                        size="m"
                        radius="rounded"
                    />
                </div>
            </div>
        </div>
    )
}