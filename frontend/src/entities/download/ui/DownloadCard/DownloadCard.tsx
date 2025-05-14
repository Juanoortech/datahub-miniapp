import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {downloadModel} from "@/entities/download"

import {PropsDefault} from "@/shared/lib/types"
import {Card} from "@/shared/ui/Card"
import {Button} from "@/shared/ui"
import {useDownloadFile} from "@/shared/lib/hooks/useDownload"

import styles from './DownloadCard.module.scss'

export const DownloadCard: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        isPending,
        ios,
        android,
        apk
    } = useSelector((state: RootState) => state.download)
    const dispatch = useDispatch<AppDispatch>()

    const { downloadFile } = useDownloadFile()

    useEffect(() => {
        if (!ios || !android || !apk) {
            dispatch(downloadModel.thunks.fetch())
        }
    }, [ios, android, apk, dispatch]);

    return (
        <Card
            className={className}
            view={'dark'}
            size={'s'}
        >
            <h3 className={styles.title}>Download DataHub</h3>
            <p className={styles.description}>Download the DataHub app and enjoy the full experience of DataHub along with big and exciting rewards!</p>
            <div className={styles.buttons}>
                <Button
                    size={'m'}
                    view={'surface-light'}
                    icon={'apple-filled'}
                    isWide={true}
                    isLoading={isPending || !ios}
                    onClick={() => window.open(ios)}
                >
                    Download for iOS
                </Button>
                <Button
                    size={'m'}
                    view={'surface-light'}
                    icon={'play-market-filled'}
                    isWide={true}
                    isLoading={isPending || !android}
                    onClick={() => window.open(android)}
                >
                    Download for Android
                </Button>
                <Button
                    size={'m'}
                    view={'surface-light'}
                    icon={'apk-filled'}
                    isWide={true}
                    isLoading={isPending || !apk}
                    onClick={() => downloadFile(apk)}
                >
                    Download APK
                </Button>
            </div>
        </Card>
    )
}