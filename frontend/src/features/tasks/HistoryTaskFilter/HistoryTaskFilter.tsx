import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {AppDispatch, RootState} from '@/app/store'

import {tasksHistoryModel} from '@/entities/history/model'

import {HistoryElementType, TaskState} from '@/shared/api/enums'
import {Tabs, TabsProps} from '@/shared/ui/Tabs'
import {PropsDefault} from '@/shared/lib/types'

import styles from './HistoryTaskFilter.module.scss'
import {clsx} from "clsx";
import {Button, Icon} from "@/shared/ui";
import {BottomSheet, useModal} from "@/shared/ui/BottomSheet";

const data: TabsProps['data'] = [
    {
        id: TaskState.REVIEW,
        text: 'In Review',
    },
    {
        id: TaskState.ACCEPTED,
        text: 'Accepted',
    },
    {
        id: TaskState.DECLINED,
        text: 'Declined',
    },
]

const historyStatusData: TabsProps['data'] = [
    {
        id: TaskState.REVIEW,
        text: 'In Review',
    },
    {
        id: TaskState.ACCEPTED,
        text: 'Accepted',
    },
    {
        id: TaskState.DECLINED,
        text: 'Declined',
    },
]

const historyTypeData: TabsProps['data'] = [
    {
        id: HistoryElementType.VALIDATION,
        text: 'Validation'
    },
    {
        id: HistoryElementType.TASK,
        text: 'Tasks',
    }
]

export const HistoryTaskFilter: React.FC<PropsDefault> = ({
    className
}) => { 
    const {  
        state,
        type,
        isPending,
    } = useSelector((state: RootState) => state.historyTasks)

    const dispatch = useDispatch<AppDispatch>()

    const { isOpen, open, close } = useModal()

    function setValue(v: (number | string)[]) {
        dispatch(tasksHistoryModel.actions.setState(v as TaskState[]))
    }

    useEffect(() => {
        dispatch(tasksHistoryModel.thunks.fetchHistory({
            state,
            type,
            page: 1,
        }))
    }, [state, type])

    return (
        <>
            <div className={clsx(className, styles.root)}>
                <Tabs
                    value={state}
                    isDisabled={isPending}
                    data={data}
                    setArrayValue={setValue}
                />
                <button
                    className={clsx(
                        styles['filters-button'],
                        {
                            [styles['is-active']]: !!state.length || !!type.length,
                        }
                    )}
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
        state,
        type,
    } = useSelector((state: RootState) => state.historyTasks)

    const dispatch = useDispatch<AppDispatch>()

    const [stateValue, setStateValue] = useState<TaskState[]>([])
    const [typeValue, setTypeValue] = useState<HistoryElementType[]>([])

    const onCancel = useCallback(() => {
        setStateValue(state)
        setTypeValue(type)

        setIsOpen(false)
    }, [state, type])

    const onApply = useCallback(() => {
        dispatch(tasksHistoryModel.actions.setState(stateValue))
        dispatch(tasksHistoryModel.actions.setType(typeValue))

        setIsOpen(false)
    }, [stateValue, typeValue])

    const onClear = () => {
        dispatch(tasksHistoryModel.actions.resetFilters())
        setIsOpen(false)
    }

    useEffect(() => {
        if (isOpen) {
            setStateValue(state)
            setTypeValue(type)
        }
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className={styles.header}>
                <h3 className={styles['header-title']}>Filter History</h3>
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
                    label={'Content Type'}
                    value={typeValue}
                    data={historyTypeData}
                    setValue={v => setTypeValue(v as HistoryElementType[])}
                />
                <Filter
                    label={'Status'}
                    value={stateValue}
                    data={historyStatusData}
                    setValue={v => setStateValue(v as TaskState[])}
                />
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