import React, {useCallback, useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {clsx} from "clsx"

import {AppDispatch, RootState} from "@/app/store"

import {transactionModel} from "@/entities/transaction"

import {PropsDefault} from "@/shared/lib/types"
import {Tabs, TabsProps} from "@/shared/ui/Tabs"
import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums"
import {Button, Icon} from "@/shared/ui"
import {BottomSheet, useModal} from "@/shared/ui/BottomSheet"

import styles from './TransactionFilters.module.scss'
import {TransitionExpand} from "@/shared/ui/TransitionExpand";

const transactionTypeData: TabsProps['data'] = [
    {
        id: TransactionType.WITHDRAW,
        text: 'Withdraw',
    },
    {
        id: TransactionType.EARNINGS,
        text: 'Earnings',
    }
]

const withdrawStatusData: TabsProps['data'] = [
    {
        id: WithdrawStatus.CONFIRMED,
        text: 'Confirmed'
    },
    {
        id: WithdrawStatus.PENDING,
        text: 'Pending'
    },
    {
        id: WithdrawStatus.REJECTED,
        text: 'Rejected'
    },
]

const earningsTypeData: TabsProps['data'] = [
    {
        id: EarningsType.TASK,
        text: 'Task'
    },
    {
        id: EarningsType.REFERRAL,
        text: 'Referral'
    },
    {
        id: EarningsType.CHALLENGE,
        text: 'Challenge'
    },
    {
        id: EarningsType.VALIDATION,
        text: 'Validation'
    }
]

export const TransactionFilters: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        transactionType,
        withdrawStatus,
        earningsType
    } = useSelector((state: RootState) => state.transactions)

    const dispatch = useDispatch<AppDispatch>()

    const { isOpen, open, close } = useModal()

    function setValue(v: (number | string)[]) {
        dispatch(transactionModel.actions.setTransactionType(v as TransactionType[]))
    }

    useEffect(() => {
        dispatch(transactionModel.thunks.fetch({
            page: 1,
            transactionType: transactionType.length ? transactionType : undefined,
            withdrawStatus: withdrawStatus.length ? withdrawStatus : undefined,
            earningType: earningsType.length ? earningsType : undefined,
        }))
    }, [transactionType, withdrawStatus, earningsType]);

    return (
        <>
            <div className={clsx(className, styles.root)}>
                <Tabs
                    className={styles.tabs}
                    view={'surface'}
                    value={transactionType}
                    data={transactionTypeData}
                    setArrayValue={setValue}
                />
                <button
                    className={styles['filters-button']}
                    onClick={open}
                >
                    <Icon
                        name={'filter'}
                        view={'dark'}
                        size={20}
                    />
                </button>
            </div>
            <FiltersModal
                isOpen={isOpen}
                setIsOpen={close}
            />
        </>
    )
}

const FiltersModal: React.FC<{
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}> = ({
    isOpen,
    setIsOpen
}) => {
    const {
        transactionType,
        withdrawStatus,
        earningsType
    } = useSelector((state: RootState) => state.transactions)

    const dispatch = useDispatch<AppDispatch>()

    const [transitionTypeValue, setTransitionType] = useState<TransactionType[]>([])
    const [withdrawStatusValue, setWithdrawStatus] = useState<WithdrawStatus[]>([])
    const [earningTypeValue, setEarningType] = useState<EarningsType[]>([])

    const onCancel = useCallback(() => {
        setTransitionType(transactionType)
        setWithdrawStatus(withdrawStatus)
        setEarningType(earningsType)

        setIsOpen(false)
    }, [transactionType, withdrawStatus, earningsType])

    const onApply = useCallback(() => {
        dispatch(transactionModel.actions.setTransactionType(transitionTypeValue))
        dispatch(transactionModel.actions.setWithdrawStatus(withdrawStatusValue))
        dispatch(transactionModel.actions.setEarningsType(earningTypeValue))

        setIsOpen(false)
    }, [transitionTypeValue, withdrawStatusValue, earningTypeValue])

    const onClear = () => {
        dispatch(transactionModel.actions.resetFilter())
        setIsOpen(false)
    }

    useEffect(() => {
        if (isOpen) {
            setTransitionType(transactionType)
            setWithdrawStatus(withdrawStatus)
            setEarningType(earningsType)
        }
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className={styles.header}>
                <h3 className={styles['header-title']}>Filter Tasks</h3>
                <Button
                    icon={'repeat'}
                    size={'s'}
                    view={'surface-critical'}
                    onClick={onClear}
                >
                    Clear All
                </Button>
            </div>
            <div className={styles.content}>
                <Filter
                    label={'Type'}
                    value={transitionTypeValue}
                    data={transactionTypeData}
                    setValue={v => setTransitionType(v as TransactionType[])}
                />
                <TransitionExpand
                    isShow={transitionTypeValue.includes(TransactionType.WITHDRAW)}
                >
                    <Filter
                        className={styles['filter-inner']}
                        label={'Withdraw Status'}
                        value={withdrawStatusValue}
                        data={withdrawStatusData}
                        setValue={v => setWithdrawStatus(v as WithdrawStatus[])}
                    />
                </TransitionExpand>
                <TransitionExpand
                    isShow={transitionTypeValue.includes(TransactionType.EARNINGS)}
                >
                    <Filter
                        className={styles['filter-inner']}
                        label={'Earnings Type'}
                        value={earningTypeValue}
                        data={earningsTypeData}
                        setValue={v => setEarningType(v as EarningsType[])}
                    />
                </TransitionExpand>
            </div>
            <div className={styles.buttons}>
                <Button
                    className={styles.button}
                    view={'surface'}
                    size={'m'}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className={styles.button}
                    view={'brand'}
                    size={'m'}
                    onClick={onApply}
                >
                    Apply
                </Button>
            </div>
        </BottomSheet>
    )
}

const Filter: React.FC<{
    className?: string
    label: string
    value: (number | string)[],
    data: TabsProps['data'],
    setValue: (v: (number | string)[]) => void
}> = ({
    className,
    label,
    value,
    data,
    setValue
}) => (
    <div className={clsx(styles.filter, className)}>
        <p className={styles.label}>{label}</p>
        <Tabs
            value={value}
            data={data}
            setArrayValue={setValue}
        />
    </div>
)