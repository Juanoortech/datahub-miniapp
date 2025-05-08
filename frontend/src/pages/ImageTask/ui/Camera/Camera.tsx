import React, {useEffect, useRef, useState} from "react"
import { createPortal } from "react-dom"
import Webcam from "react-webcam"

import {useTelegram} from "@/shared/lib/hooks/useTelegram"

import styles from './Camera.module.scss'
import {ButtonIcon} from "@/shared/ui/ButtonIcon";

export type CameraProps = {
    onTakePhoto: (v: File) => void
    onUserMediaError: () => void
    onBack: () => void
}

export const Camera: React.FC<CameraProps> = ({
    onTakePhoto,
    onUserMediaError,
    onBack
}) => {
    const { BackButton } = useTelegram()

    const webcamRef = useRef<Webcam | null>(null);

    const [isLoading, setIsLoading] = useState(true)
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

    function onClick() {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            if (imageSrc) {
                fetch(imageSrc)
                .then((res) => res.blob())
                    .then((blob) => {
                        const file = new File(
                            [blob], 
                            'camera-photo.png', 
                            { type: 'image/png' }
                        );
                        onTakePhoto(file)
                    });
            }
        }
    }

    useEffect(() => {
        BackButton.onClick(onBack)
        BackButton.show()
    }, []);

    return createPortal(
        <div 
            className={[
                styles.root,
                isLoading ? styles['is-loading'] : ''
            ].join(' ').trim()}
        >
            <Webcam
                ref={webcamRef}
                className={styles.webcam}
                height={window.innerHeight}
                audio={false}
                screenshotFormat="image/jpeg"
                mirrored={facingMode === 'user'}
                videoConstraints={{
                    facingMode,
                    height: window.innerHeight,
                }}
                screenshotQuality={1}
                onUserMedia={() => {
                    setIsLoading(false)
                }}
                onUserMediaError={onUserMediaError}
            />
            <button 
                className={styles.button}
                onClick={onClick}
            />
            <ButtonIcon
                className={styles['button-toggle']}
                size={'l'}
                view={'flat'}
                icon={'repeat'}
                onClick={() => {
                    setFacingMode(prevState => {
                        if (prevState === 'user') {
                            return 'environment'
                        }

                        return 'user'
                    })
                }}
            />
        </div>,
        document.body
    )
}