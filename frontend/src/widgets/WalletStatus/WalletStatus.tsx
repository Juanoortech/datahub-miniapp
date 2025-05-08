import { useSelector } from "react-redux"
import {clsx} from "clsx"

import { RootState } from "@/app/store"

import { ModalDownload } from "@/entities/download"

import {Icon} from "@/shared/ui"
import {useModal} from "@/shared/ui/BottomSheet"

import styles from './WalletStatus.module.scss'

export const WalletStatus = () => {
    const {
        data,
    } = useSelector((state: RootState) => ({
        data: state.viewer.data,
    }))

    const { isOpen, open, close } = useModal()

    function onOpen() {
        if (!data.isWalletConnect) {
            open()
        }
    }

    return (
        <>
            <div
                className={clsx(
                    styles.root,
                    {
                        [styles['is-connected']]: data.isWalletConnect,
                    }
                )}
                onClick={onOpen}
            >
                <Icon
                    name={'link-outline'}
                    size={20}
                    view={data.isWalletConnect ? 'surface' : 'dark'}
                />
                <p>
                    {
                        data.isWalletConnect
                            ? 'OORT Wallet Connected'
                            : 'Link OORT Wallet'
                    }
                </p>
            </div>
            <ModalDownload
                isOpen={isOpen}
                setIsOpen={close}
            />
        </>
    )
}