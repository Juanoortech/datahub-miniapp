import React from "react"
import { useSelector } from "react-redux"

import { RootState } from "@/app/store"

import { StartTask } from "@/widgets/activeTasks"

import { ExpandTask } from "@/entities/tasks/model/types"

import { LazyImage } from "@/shared/ui/LazyImage/LazyImage"
import { Button } from "@/shared/ui"
import { useUploadFile } from "@/shared/lib/hooks/useUploadFile"

import styles from './Start.module.scss'

export type StartProps = {
    id: ExpandTask['id']
    onTakePhoto: () => void
    onPhotoUploaded: (v: File) => void
}

const StartComponent: React.FC<StartProps> = ({
    id,
    onTakePhoto,
    onPhotoUploaded,
}) => {
    const pool = useSelector((state: RootState) => state.expandTasks.pool)

    const taskData = pool[id]

    const { onUploadClick } = useUploadFile()

    function onUploadFile(e: {
        target: {
            files: FileList | null
        }
    }) {
        try {
            if (e.target.files && e.target.files) {
                const file = e.target.files[0]
                onPhotoUploaded(file)
            }
        } catch (e) {
            alert(e)
        }
    }

    return (
        <StartTask 
            PreviewComponent={(
                <LazyImage
                    className={styles['preview-img']}
                    src={taskData.example}
                    alt="example"
                    skeletonMinHeight={250}
                />
            )}
            task={taskData.task}
            ActionsComponent={(
                <>
                    <Button
                        view={'surface'}
                        isWide={true}
                        onClick={() => onUploadClick(
                            'image/*',
                            onUploadFile,
                        )}
                    >
                        Upload Picture
                    </Button>
                    <Button
                        view={'surface'}
                        isWide={true}
                        onClick={onTakePhoto}
                    >
                        Open Camera
                    </Button>
                </>
            )}
        />
    )
}

export const Start = React.memo(StartComponent)