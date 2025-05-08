import React, {useCallback} from "react"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {clsx} from "clsx"

import {AppDispatch} from "@/app/store"

import {cancelTaskModel, RemoveCompletionModal} from "@/features/tasks"

import {PropsDefault, RouterPathes} from "@/shared/lib/types"
import {LazyImage} from "@/shared/ui/LazyImage"
import {useTimer} from "@/shared/lib/hooks/useTimer"
import {Button} from "@/shared/ui"
import {Badge} from "@/shared/ui/Badge";
import {TaskType} from "@/shared/api/enums"
import {useModal} from "@/shared/ui/BottomSheet"

import {expandTasksModel, StartedTaskItem} from '../../model'

import styles from './StartedTaskCard.module.scss'

export type StartedTaskCardProps = PropsDefault<StartedTaskItem>

const StartedTaskCardComponent: React.FC<StartedTaskCardProps> = ({
    className,
    ...startedTask
}) => {
    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const onEnd = useCallback(() => {
        dispatch(cancelTaskModel.thunks.cancelTask(startedTask))
    }, [startedTask])

    const { isOpen, open, close } = useModal()
    const { hms } = useTimer(
        startedTask.timer,
        'down',
        onEnd
    )

    const onContinue = useCallback(() => {
        dispatch(expandTasksModel.actions.setCompletionId(startedTask.completionId))
        if (startedTask.type === TaskType.IMAGE) {
            navigate(
                RouterPathes.PHOTO_TASK.replace(':id', `${startedTask.taskId}`)
            )
            return
        }
        if (startedTask.type === TaskType.VIDEO) {
            navigate(
                RouterPathes.VIDEO_TASK.replace(':id', `${startedTask.taskId}`)
            )
            return
        }
        if (startedTask.type === TaskType.AUDIO) {
            navigate(
                RouterPathes.AUDIO_TASK.replace(':id', `${startedTask.taskId}`)
            )
            return
        }
    }, [startedTask])

    return (
        <>
            <div className={clsx(className, styles.root)}>
                <div className={styles['image-wrapper']}>
                    <Badge
                        className={styles.badge}
                        size={'m'}
                        view={'brand'}
                        icon={'coin'}
                    >
                        {startedTask.award} Pts
                    </Badge>
                    <LazyImage
                        className={styles.image}
                        src={startedTask.img}
                        alt={`started-task-${startedTask.completionId}`}
                        skeletonMinHeight={112}
                    />
                </div>
                <div className={styles.content}>
                    <p className={styles.title}>
                        The task will be <br/> cancelled in <span>{hms.h}:{hms.m}:{hms.s}</span>
                    </p>
                    <div className={styles.buttons}>
                        <Button
                            view={'surface-critical'}
                            size={'s'}
                            onClick={open}
                        >
                            Cancel
                        </Button>
                        <Button
                            view={'brand'}
                            size={'s'}
                            onClick={onContinue}
                        >
                            Continue task
                        </Button>
                    </div>
                </div>
            </div>
            <RemoveCompletionModal
                isOpen={isOpen}
                setIsOpen={close}
                task={startedTask}
                onContinue={onContinue}
            />
        </>
    )
}

export const StartedTaskCard = React.memo(StartedTaskCardComponent)