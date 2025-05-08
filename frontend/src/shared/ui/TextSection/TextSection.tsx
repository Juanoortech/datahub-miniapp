import React from "react"
import {clsx} from "clsx"

import { PropsDefault } from "@/shared/lib/types"

import styles from './TextSection.module.scss'

export type TextSectionProps = PropsDefault<{
    label: string
    description: string
}>

const TextSectionComponent: React.FC<TextSectionProps> = ({
    className,
    label,
    description
}) => {
    return (
        <div className={clsx(styles.root, className)}>
            <p className={styles.label}>{label}</p>
            <div className={styles.content}>
                <p>{description}</p>
            </div>
        </div>
    )
}

export const TextSection = React.memo(TextSectionComponent)