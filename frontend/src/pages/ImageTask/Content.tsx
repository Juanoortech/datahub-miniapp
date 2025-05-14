import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch, RootState } from "@/app/store"

import { TaskResponse } from "@/widgets/activeTasks"

import { uploadTaskFileModel } from "@/features/tasks"

import { ExpandTask } from "@/entities/tasks/model/types"

import { TransitionFade } from "@/shared/ui/TransitionFade"
import {useBackButton, useGlobalTrigger, useToaster} from "@/shared/providers"

import { Start, Verify, Camera, Info } from './ui'

enum Step {
    INFO,
    START,
    CAMERA,
    VERIFY,
    RESPONSE,
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

    const taskData = pool[id]

    function onTakePhotoClick() {
        setStep(Step.CAMERA)
    }

    function onCameraError() {
        setStep(Step.START)
        toast({
            type: 'error',
            text: "We couldn't access your camera"
        })
    }

    function onSubmit() {
        if (value) {
            dispatch(uploadTaskFileModel.thunks.uploadTaskFile({
                file: value,
                completionId,
            }))
        }
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
    }, [isError, trigger])

    useEffect(() => {
        return () => {
            dispatch(uploadTaskFileModel.actions.reset())
        }
    }, [dispatch])

    useEffect(() => {
        if (step === Step.CAMERA) {
            show(() => {
                setStep(Step.START)
            })
        } else {
            show()
        }
    }, [show, step]);

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
                    onTakePhoto={onTakePhotoClick}
                    onPhotoUploaded={v => {
                        setValue(v)
                        setStep(Step.VERIFY)
                    }}  
                />
            )}
            {step === Step.VERIFY && (
                <Verify 
                    key={'Verify'}
                    value={value!}
                    onPhotoUploaded={v => {
                        setValue(v)
                        setStep(Step.VERIFY)
                    }}
                    onSubmit={onSubmit}
                />
            )}
            {step === Step.CAMERA && (
                <Camera 
                    key={'Camera'}
                    onTakePhoto={v => {
                        setValue(v)
                        setStep(Step.VERIFY)
                    }}
                    onUserMediaError={onCameraError}
                    onBack={() => {
                        setStep(Step.START)
                    }}
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