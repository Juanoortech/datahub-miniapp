import React from 'react'
import { Drawer } from 'vaul'

import styles from './BottomSheet.module.scss'

export type BottomSheetProps = React.PropsWithChildren<{
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}>

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
    isOpen,
    children,
    setIsOpen,
}) => (
    <Drawer.Root noBodyStyles open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
            <Drawer.Overlay className={styles.overlay} />
            <Drawer.Content
                className={styles.root}>
                <div className={styles.wrapper}>
                    <Drawer.Title>
                        <div className={styles.header} />
                    </Drawer.Title>
                    <div className={styles.container}>{children}</div>
                </div>
            </Drawer.Content>
        </Drawer.Portal>
    </Drawer.Root>
)

export const BottomSheet = React.memo(BottomSheetComponent)