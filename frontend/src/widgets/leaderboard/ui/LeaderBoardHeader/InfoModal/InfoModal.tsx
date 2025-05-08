import React from 'react'

import {Modal} from "@/shared/ui/Modal"
import {Button} from "@/shared/ui"

import styles from './InfoModal.module.scss'

export type InfoModalProps = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}

export const InfoModal: React.FC<InfoModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={'Prizes and gifts'}
        >
            <p className={styles.description}>
                Earn points and save them. Winners of 1-5 places in the leaderboard receive a bonus - multiplication of the reward for completing tasks!
            </p>
            <Button
                isWide={true}
                onClick={() => setIsOpen(false)}
            >
                OK
            </Button>
        </Modal>
    )
}