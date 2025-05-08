import React, {useMemo} from "react"

import {PropsDefault} from "@/shared/lib/types"
import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums"
import {Icon, IconProps} from "@/shared/ui"
import {Badge, BadgeProps} from "@/shared/ui/Badge"
import {toFormattedNumber} from "@/shared/lib/number"

import {TransactionItem} from "../../model"

import styles from './TransactionCard.module.scss'
import {clsx} from "clsx";

export type TransactionCardProps = PropsDefault<TransactionItem>

const TransactionCardComponent: React.FC<TransactionCardProps> = ({
    className,
    ...transaction
}) => {
    const icon = useMemo<IconProps['name']>(() => {
        if (transaction.type === TransactionType.WITHDRAW) {
            return 'arrow-up-circle'
        }

        if (transaction.earningsType === EarningsType.REFERRAL) {
            return 'referrals-duo'
        }

        if (transaction.earningsType === EarningsType.CHALLENGE) {
            return 'challenge'
        }

        return 'tick-square'
    }, [transaction])

    const badgeProps = useMemo<BadgeProps | null>(() => {
        if (transaction.type === TransactionType.EARNINGS) {
            return null
        }

        if (transaction.withdrawStatus === WithdrawStatus.PENDING) {
            return {
                view: 'secondary',
                size: 'xs',
                children: 'Pending'
            }
        }

        if (transaction.withdrawStatus === WithdrawStatus.REJECTED) {
            return {
                view: 'critical',
                size: 'xs',
                children: 'Rejected',
            }
        }

        return {
            view: 'success',
            size: 'xs',
            children: 'Confirmed',
        }
    }, [transaction])

    const title = useMemo(() => {
        if (transaction.type === TransactionType.WITHDRAW) {
            return 'Withdraw'
        }

        if (transaction.earningsType === EarningsType.TASK) {
            return 'Task'
        }

        if (transaction.earningsType === EarningsType.CHALLENGE) {
            return 'Challenge'
        }

        if (transaction.earningsType === EarningsType.VALIDATION) {
            return 'Validation'
        }

        return 'Referral'
    }, [transaction])

    const description = useMemo(() => {
        if (transaction.type === TransactionType.WITHDRAW) {
            return null
        }

        return transaction.referralName
    }, [transaction])

    const amount = useMemo<AmountProps>(() => {
        if (transaction.type === TransactionType.WITHDRAW) {
            return {
                type: 'minus',
                amount: transaction.amount
            }
        }

        return {
            type: 'plus',
            amount: transaction.amount,
        }
    }, [transaction])

    return (
        <div className={clsx(className, styles.root)}>
            <div className={styles.row}>
                <Icon
                    className={styles.icon}
                    name={icon}
                    view={'secondary'}
                    size={24}
                />
                <div>
                    <div className={styles.row}>
                        <p className={styles.title}>{title}</p>
                        {badgeProps && (
                            <Badge
                                className={styles.badge}
                                {...badgeProps}
                            />
                        )}
                    </div>
                    {description && (
                        <p className={styles.description}>{description}</p>
                    )}
                </div>
            </div>
            <Amount
                {...amount}
            />
        </div>
    )
}

export const TransactionCard = React.memo(TransactionCardComponent)

type AmountProps = {
    type: 'plus' | 'minus'
    amount: number
}

const Amount: React.FC<AmountProps> = ({
    type,
    amount
}) => {
    const value = useMemo(() => {
        const amountValue = toFormattedNumber(amount)

        if (type === 'plus') {
            return `+${amountValue} Ptc`
        }

        return `-${amountValue} Ptc`
    }, [type, amount])

    return (
        <p
            className={clsx(styles.amount, styles[`amount-view_${type}`])}
        >
            {value}
        </p>
    )
}