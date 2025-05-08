import React from "react"
import {clsx} from "clsx"

import { PropsDefault } from "@/shared/lib/types"

import styles from './CopyCell.module.scss'

export const CopyCellSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div
        className={clsx(styles['cell-skeleton'], className)}
    />
)