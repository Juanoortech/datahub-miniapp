import React from "react"
import {clsx} from "clsx"

import {images} from "@/shared/assets/images"
import {PropsDefault} from "@/shared/lib/types"
import {LazyImage} from "@/shared/ui/LazyImage"

import styles from './EmptyResponse.module.scss'

export type EmptyResponseProps = PropsDefault<{
    image: keyof typeof images.Empty
    title: string
}>

const EmptyResponseComponent: React.FC<EmptyResponseProps> = ({
    className,
    image,
    title
}) => (
    <div className={clsx(styles.root, className)}>
        <LazyImage
            className={styles.image}
            src={images.Empty[image]}
            alt={'empty'}
            skeletonMinHeight={160}
        />
        <p className={styles.title}>{title}</p>
    </div>
)

export const EmptyResponse = React.memo(EmptyResponseComponent)