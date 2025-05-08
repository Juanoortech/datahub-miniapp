import React from "react"

import {TextSkeleton} from "@/shared/ui/TextSkeleton"
import {ButtonSkeleton} from "@/shared/ui/Button/ButtonSkeleton"

import { data } from './model'
import styles from './ValidationRate.module.scss'

export const ValidationRateSkeleton = () => (
    <div className={styles.root}>
        <TextSkeleton
            fontSize={18}
            lineHeight={24}
            widthRange={[0.5, 0.7]}
        />
        <div className={styles.row}>
            {data.map(item => (
                <div className={styles.item}>
                    <p className={styles.smile}>{item.smile}</p>
                    <ButtonSkeleton />
                </div>
            ))}
        </div>
    </div>
)