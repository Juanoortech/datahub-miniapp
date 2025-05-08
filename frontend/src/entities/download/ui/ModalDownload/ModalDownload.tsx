import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store";
import React, {useEffect} from "react";
import {downloadModel} from "@/entities/download";
import {Button} from "@/shared/ui";
import {CopyCell} from "@/shared/ui/CopyCell";
import {Modal} from "@/shared/ui/Modal";
import {useTelegram} from "@/shared/lib/hooks/useTelegram";
import {useDownloadFile} from "@/shared/lib/hooks/useDownload";

import styles from "./ModalDownload.module.scss";

export type ModalDownloadProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export const ModalDownload: React.FC<ModalDownloadProps> = ({
    isOpen,
    setIsOpen
}) => {
    const {
        data,
        isPending,
        ios,
        android,
        apk
    } = useSelector((state: RootState) => ({
        data: state.viewer.data,
        isPending: state.download.isPending,
        ios: state.download.ios,
        android: state.download.android,
        apk: state.download.apk,
    }))
    const dispatch = useDispatch<AppDispatch>()

    const { openLink } = useTelegram()
    const { downloadFile } = useDownloadFile()

    useEffect(() => {
        if (!ios || !android || !apk) {
            dispatch(downloadModel.thunks.fetch())
        }
    }, [isOpen]);

    return (
        <Modal
            title={'Link Wallet'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <p className={styles.description}>To connect OORT Wallet, download DataHub mobile application and link this account using a unique code</p>
            <div className={styles.buttons}>
                <Button
                    size={'m'}
                    view={'surface'}
                    icon={'apple-filled'}
                    isWide={true}
                    isLoading={isPending || !ios}
                    onClick={() => openLink(ios)}
                >
                    Download for iOS
                </Button>
                <Button
                    size={'m'}
                    view={'surface'}
                    icon={'play-market-filled'}
                    isWide={true}
                    isLoading={isPending || !android}
                    onClick={() => openLink(android)}
                >
                    Download for Android
                </Button>
                <Button
                    size={'m'}
                    view={'surface'}
                    icon={'apk-filled'}
                    isWide={true}
                    isLoading={isPending || !apk}
                    onClick={() => downloadFile(apk)}
                >
                    Download APK
                </Button>
            </div>
            <CopyCell
                label={'Your Wallet Connection Code'}
                value={data.walletConnectCode}
            />
        </Modal>
    )
}