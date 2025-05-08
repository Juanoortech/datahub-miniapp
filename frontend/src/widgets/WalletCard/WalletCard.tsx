import React from "react"
import {useSelector} from "react-redux"

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"
import {CardInfo} from "@/shared/ui/CardInfo"
import {useModal} from "@/shared/ui/BottomSheet"
import {ModalDownload} from "@/entities/download"

import styles from './WalletCard.module.scss'
import {clsx} from "clsx";

export const WalletCard: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        data,
    } = useSelector((state: RootState) => ({
        data: state.viewer.data,
    }))
    const { isOpen, open, close } = useModal()

    if (data.isWalletConnect) {
        return null
    }

    return (
        <>
            <CardInfo
                className={clsx(className, styles.root)}
                title={'Link OORT Wallet'}
                description={'Connect OORT Wallet to withdraw points and earn even more'}
                icon={'link-outline'}
                onClick={open}
            />
            <ModalDownload
                isOpen={isOpen}
                setIsOpen={close}
            />
        </>
    )
}