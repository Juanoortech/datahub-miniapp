import React, {useEffect} from "react";
import {createPortal} from "react-dom";
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import {AnimatePresence, motion} from 'framer-motion'

import {Icon} from "@/shared/ui";

import styles from './Modal.module.scss'

export type ModalProps = React.PropsWithChildren<{
    title: string
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}>

const ModalComponent: React.FC<ModalProps> = ({
    title,

    isOpen,
    setIsOpen,

    children
}) => {
    useEffect(() => {
        if (isOpen) {
            disablePageScroll()
        } else {
            enablePageScroll()
        }

        return () => {
            enablePageScroll()
        }
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className={styles.root}>
                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0
                        }}
                        className={styles.overlay}
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        className={styles.card}
                        initial={{
                            opacity: 0,
                            y: 100
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            y: 100
                        }}
                    >
                        <div>
                            <div className={styles.header}>
                                <h4 className={styles.title}>{title}</h4>
                                <button
                                    className={styles.button}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon
                                        name={'close'}
                                        view={'dark'}
                                        size={20}
                                    />
                                </button>
                            </div>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.querySelector('#root')!
    )
}

export const Modal = React.memo(ModalComponent)