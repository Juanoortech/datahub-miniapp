import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {TaskResponse} from "@/widgets/activeTasks"

import { uploadTaskFileModel } from "@/features/tasks"

import {ExpandTask} from "@/entities/tasks/model/types"

import {TransitionFade} from "@/shared/ui/TransitionFade"
import {useGlobalTrigger} from "@/shared/providers"

import { Info, Start } from './ui'

enum Step {
    INFO,
    START,
    RESPONSE
}

export const Content: React.FC<{
    id: ExpandTask['id']
}> = ({
    id
}) => {
    const { pool, completionId } = useSelector((state: RootState) => state.expandTasks)
    const { isSuccess, isError, isPending, } = useSelector((state: RootState) => state.uploadTaskFile)
    const dispatch = useDispatch<AppDispatch>()

    const { trigger } = useGlobalTrigger()

    const [step, setStep] = useState<Step>(Step.INFO)

    const taskData = pool[id]

    function onSubmit(value: File) {
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
    }, [isError])

    useEffect(() => {
        return () => {
            dispatch(uploadTaskFileModel.actions.reset())
        }
    }, []);

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
                    isLoading={isPending}
                    onSubmit={v => {
                        console.log("Content onSubmit", v)
                        onSubmit(v)
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