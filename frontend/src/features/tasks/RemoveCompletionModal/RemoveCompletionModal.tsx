import React, {useCallback, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import { cancelTaskModel } from "@/features/tasks"

import { StartedTaskItem } from "@/entities/tasks"

import { Modal } from "@/shared/ui/Modal"
import { Button } from "@/shared/ui"

import styles from './RemoveCompletionModal.module.scss'

export type RemoveCompletionModalProps = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    task: StartedTaskItem
    onContinue: () => void
}

const RemoveCompletionModalComponent: React.FC<RemoveCompletionModalProps> = ({
    isOpen,
    setIsOpen,
    task,
    onContinue
}) => {
    const dispatch = useDispatch<AppDispatch>()

    const {
        isCanceling,
        isSuccess,
    } = useSelector((state: RootState) => ({
        isCanceling: state.cancelTask.isPending,
        isSuccess: state.cancelTask.isSuccess,
    }))

    const onCancel = useCallback(() => {
        dispatch(cancelTaskModel.thunks.cancelTask(task))
    }, [task])

    useEffect(() => {
        if (isSuccess) {
            dispatch(cancelTaskModel.actions.reset())
            setIsOpen(false)
        }
    }, [isSuccess]);

    return (
        <Modal
            title={'Are you sure you want to cancel the task?'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <p className={styles.description}>
                The task will be cancelled and you will not receive a reward for the task.
            </p>
            <Button
                className={styles.button}
                view={'critical'}
                size={'m'}
                isWide={true}
                isLoading={isCanceling}
                onClick={onCancel}
            >
                Cancel task
            </Button>
            <Button
                className={styles.button}
                view={'surface'}
                size={'m'}
                isWide={true}
                isDisabled={isCanceling}
                onClick={onContinue}
            >
                Continue task
            </Button>
        </Modal>
    )
}

export const RemoveCompletionModal = React.memo(RemoveCompletionModalComponent)
