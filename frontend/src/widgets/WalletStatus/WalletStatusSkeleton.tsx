import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"

import styles from './WalletStatus.module.scss'

export const WalletStatusSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div className={clsx(className, styles.root)} />
)