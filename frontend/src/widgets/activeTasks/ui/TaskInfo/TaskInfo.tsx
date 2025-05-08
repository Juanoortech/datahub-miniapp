import React, {useCallback} from "react"

import { ExpandTaskDetails, ExpandTaskDetailsProps } from "../ExpandTaskDetails"

import styles from './TaskInfo.module.scss'
import { LazyImage } from "@/shared/ui/LazyImage/LazyImage"
import { FloatingButtons } from "@/shared/ui/FloatingButtons"
import { Button } from "@/shared/ui"
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/app/store";
import {expandTasksModel} from "@/entities/tasks";
import {CaptchaModal} from "@/widgets/CaptchaModal";
import {useModal} from "@/shared/ui/BottomSheet";

export type TaskInfoProps = {
    id: number
    title: string
    img: string
    description: string
    details: string
    taskDetails: ExpandTaskDetailsProps
    isContinue: boolean
    onStart: () => void
}

const TaskInfoComponent: React.FC<TaskInfoProps> = ({
    id,
    title,
    img,
    description,
    details,
    taskDetails,
    isContinue,
    onStart
}) => {
    const dispatch = useDispatch<AppDispatch>()

    const onClick = useCallback(() => {
        if (!isContinue) {
            dispatch(expandTasksModel.thunks.createCompletion({
                task_id: id,
            }))
        }

        onStart()
    }, [isContinue, id])

    return (
        <>
            <div>
                <h1
                    className={styles.title}
                >
                    {title}
                </h1>
                <LazyImage
                    className={styles['main-image']}
                    src={img}
                    alt="image"
                    skeletonMinHeight={280}
                />
                <p className={styles.description}>{description}</p>
                <h2 className={styles['details-title']}>Task Details</h2>
                <p className={styles.details}>{details}</p>
                <ExpandTaskDetails
                    className={styles['details-card']}
                    {...taskDetails}
                />
                <FloatingButtons>
                    <Button
                        view={'brand'}
                        isWide={true}
                        onClick={onClick}
                    >
                        {isContinue ? 'Continue task' : 'Start'}
                    </Button>
                </FloatingButtons>
            </div>
        </>
    )
}

export const TaskInfo = React.memo(TaskInfoComponent)