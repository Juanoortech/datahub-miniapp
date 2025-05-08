import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { RootState } from "@/app/store"

import { useUploadFile } from "@/shared/lib/hooks/useUploadFile"
import { VerifyTask } from "@/widgets/activeTasks"
import { VideoPlayer } from "@/shared/ui/VideoPlayer"
import { Button } from "@/shared/ui"
import {useModal} from "@/shared/ui/BottomSheet";
import {CaptchaModal} from "@/widgets/CaptchaModal";

export type VerifyProps = {
    value: File
    blob: Blob | null
    onSubmit: () => void
    onVideoUploaded: (v: File) => void
}

const VerifyComponent: React.FC<VerifyProps> = ({
    value,
    blob,
    onSubmit,
    onVideoUploaded
}) => {
    const { isPending } = useSelector((state: RootState) => state.uploadTaskFile)

    const { onUploadClick } = useUploadFile()
    const {isOpen, open, close} = useModal()

    const [preview, setPreview] = useState('')

    function onUploadFile(e: {
        target: {
            files: FileList | null
        }
    }) {
        try {
            if (e.target.files && e.target.files) {
                const file = e.target.files[0]
                onVideoUploaded(file)
            }
        } catch (e) {
            alert(e)
        }
    }

    useEffect(() => {
        const url = URL.createObjectURL(blob ? blob : value)
        setPreview(url)
    }, [blob, value])

    return (
        <>
            <VerifyTask
                title={'Verify your video'}
                description={'Check if the video has a good quality and your voice is clearly audible.'}
                VerifyComponent={(
                    <VideoPlayer
                        src={preview}
                    />
                )}
                Actions={(
                    <>
                        <Button
                            view={'surface'}
                            isWide={true}
                            onClick={() => onUploadClick(
                                'video/*',
                                onUploadFile,
                            )}
                        >
                            Re-upload
                        </Button>
                        <Button
                            view={'brand'}
                            isLoading={isPending}
                            isWide={true}
                            onClick={open}
                        >
                            Proceed
                        </Button>
                    </>
                )}
            />
            <CaptchaModal
                isOpen={isOpen}
                setIsOpen={close}
                onSuccess={() => {
                    close()
                    onSubmit()
                }}
            />
        </>
    )
}

export const Verify = React.memo(VerifyComponent)