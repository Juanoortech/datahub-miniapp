import React from "react"
import { useSelector } from "react-redux"

import { RootState } from "@/app/store"

import { StartTask } from "@/widgets/activeTasks"

import { ExpandTask } from "@/entities/tasks/model/types"

import { useUploadFile } from "@/shared/lib/hooks/useUploadFile"
import { Button } from "@/shared/ui"
import { VideoPlayer } from "@/shared/ui/VideoPlayer"

export type StartProps = {
    id: ExpandTask['id']
    onTakeVideo: () => void
    onVideoUploaded: (v: File) => void
}

const StartComponent: React.FC<StartProps> = ({
    id,
    onTakeVideo,
    onVideoUploaded,
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
                onVideoUploaded(file)
            }
        } catch (e) {
            alert(e)
        }
    }

    return (
        <StartTask 
            PreviewComponent={(
                <VideoPlayer 
                    src={taskData.example}
                />
            )}
            task={taskData.task}
            ActionsComponent={(
                <>
                    <Button
                        view={'surface'}
                        isWide={true}
                        onClick={() => onUploadClick(
                            'video/*',
                            onUploadFile,
                        )}
                    >
                        Upload Video
                    </Button>
                    <Button
                        view={'surface'}
                        isWide={true}
                        onClick={onTakeVideo}
                    >
                        Open Camera
                    </Button>
                </>
            )}
        />
    )
}

export const Start = React.memo(StartComponent)