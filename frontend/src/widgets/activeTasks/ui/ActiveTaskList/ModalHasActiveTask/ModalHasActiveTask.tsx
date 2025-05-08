import React from 'react'

import {Modal} from "@/shared/ui/Modal"
import {Button} from "@/shared/ui"

import styles from './ModalHasActiveTask.module.scss'

export type ModalHasActiveTaskProps = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}

export const ModalHasActiveTask: React.FC<ModalHasActiveTaskProps> = ({
    isOpen,
    setIsOpen,
}) => (
    <Modal
        title={'You have not completed the previous task'}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    >
        <p className={styles.description}>
            Complete the old task or cancel it to start a new one.
        </p>
        <Button
            className={styles.button}
            view={'brand'}
            size={'m'}
            isWide={true}
            onClick={() => setIsOpen(false)}
        >
            Okay
        </Button>
    </Modal>
)