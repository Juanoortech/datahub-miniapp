import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {toFormattedNumber} from "@/shared/lib/number"
import {ButtonIcon} from "@/shared/ui/ButtonIcon"

import styles from './Balance.module.scss'

export type BalanceProps = PropsDefault<{
    label: string
    balance: number
    onClick: () => void
}>

const BalanceComponent: React.FC<BalanceProps> = ({
    className,
    label,
    balance,
    onClick
}) => {
    return (
        <div className={clsx(styles.root, className)}>
            <p>{label}</p>
            <div className={styles.wrapper}>
                <p
                    className={styles.amount}
                >
                    {toFormattedNumber(balance)} <span>Pts</span>
                </p>
                <ButtonIcon
                    size={'m'}
                    view={'surface'}
                    icon={'chevron-right-outline'}
                    onClick={onClick}
                />
            </div>
        </div>
    )
}

export const Balance = React.memo(BalanceComponent)