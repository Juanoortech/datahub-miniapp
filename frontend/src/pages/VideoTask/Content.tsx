import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/app/store"

import { TaskResponse } from "@/widgets/activeTasks"

import { uploadTaskFileModel } from "@/features/tasks"

import { ExpandTask } from "@/entities/tasks/model/types"

import { TransitionFade } from "@/shared/ui/TransitionFade"
import {useBackButton, useGlobalTrigger, useToaster} from "@/shared/providers"

import { Start, Info, Camera, Verify } from './ui'

enum Step {
    INFO,
    START,
    CAMERA,
    VERIFY,
    RESPONSE
}

export const Content: React.FC<{
    id: ExpandTask['id']
}> = ({
    id
}) => {
    const { pool, completionId } = useSelector((state: RootState) => state.expandTasks)
    const { isSuccess, isError } = useSelector((state: RootState) => state.uploadTaskFile)
    const dispatch = useDispatch<AppDispatch>()

    const { trigger } = useGlobalTrigger()
    const { toast } = useToaster()
    const { show } = useBackButton()

    const [value, setValue] = useState<File | null>(null)
    const [step, setStep] = useState<Step>(Step.INFO)
    const [blob, setBlob] = useState<Blob | null>(null)

    const taskData = pool[id]

    function onSubmit() {
        if (value) {
            dispatch(uploadTaskFileModel.thunks.uploadTaskFile({
                file: value,
                completionId,
            }))
        }
    }

    function onCameraError() {
        setStep(Step.START)
        toast({
            type: 'error',
            text: "We couldn't access your camera"
        })
    }

    useEffect(() => {
        if (isSuccess) {
            setStep(Step.RESPONSE)
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            trigger()
        }
    }, [isError])

    useEffect(() => {
        return () => {
            dispatch(uploadTaskFileModel.actions.reset())
        }
    }, [])

    useEffect(() => {
        if (step === Step.CAMERA) {
            show(() => {
                setStep(Step.START)
            })
        } else {
            show()
        }
    }, [step]);

    return (
        <TransitionFade>
            {step === Step.INFO && (
                <Info 
                    key={'Info'}
                    id={id}
                    onStart={() => {
                        setStep(Step.START)
                    }}
                />
            )}
            {step === Step.START && (
                <Start 
                    key={'Start'}
                    id={id}
                    onTakeVideo={() => {
                        setStep(Step.CAMERA)
                    }}
                    onVideoUploaded={v => {
                        setValue(v)
                        setBlob(null)
                        setStep(Step.VERIFY)
                    }}
                />
            )}
            {step === Step.CAMERA && (
                <Camera 
                    key={'Camera'}
                    onTakeVideo={blob => {
                        const file = new File(
                            [blob], 
                            'recorded-video.webm', 
                            { type: 'video/webm' }
                        )
                        setValue(file)
                        setBlob(blob)
                        setStep(Step.VERIFY)
                    }}
                    onUserMediaError={onCameraError}
                    onBack={() => {
                        setStep(Step.START)
                    }}
                />
            )}
            {step === Step.VERIFY && (
                <Verify 
                    key={'Verify'}
                    value={value!}
                    blob={blob}
                    onVideoUploaded={v => {
                        setValue(v)
                        setBlob(null)
                        setStep(Step.VERIFY)
                    }}
                    onSubmit={onSubmit}
                />
            )}
            {step === Step.RESPONSE && (
                <TaskResponse 
                    key={'Response'}
                    award={taskData.reward}
                />
            )}
        </TransitionFade>
    )
}
