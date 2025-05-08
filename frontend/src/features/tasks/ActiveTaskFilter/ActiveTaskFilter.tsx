import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/app/store";

import {activeTasksModel, startedTaskModel} from "@/entities/tasks";

import { TaskType } from "@/shared/api/enums";
import { PropsDefault } from "@/shared/lib/types";
import { Tabs, TabsProps } from "@/shared/ui/Tabs";

import styles from './ActiveTaskFilter.module.scss'

const data: TabsProps['data'] = [
    {
        text: 'All',
        id: 'all'
    },
    {
        id: TaskType.IMAGE,
        text: 'Image',
        icon: 'image-filled',
        iconColor: 'success'
    },
    {
        id: TaskType.AUDIO,
        text: 'Audio',
        icon: 'audio',
        iconColor: 'brand',
    },
    {
        id: TaskType.VIDEO,
        text: 'Video',
        icon: 'video',
        iconColor: 'critical'
    }
]

export const ActiveTaskFilter: React.FC<PropsDefault> = ({
    className
}) => {
    const { activeType, isPending } = useSelector((state: RootState) => state.activeTasks)
    const dispatch = useDispatch<AppDispatch>()

    function setValue(v: number | string) {
        dispatch(activeTasksModel.actions.setActiveType(v as 'all' | TaskType))
    }

    useEffect(() => {
        dispatch(activeTasksModel.thunks.fetchTasks({
            page: 1,
            type: activeType,
        }))
        dispatch(startedTaskModel.thunks.fetchStartedTask())
    }, [activeType])

    return (
        <Tabs 
            className={[
                className ? className : '',
                styles.root
            ].join(' ').trim()}
            value={activeType}
            isDisabled={isPending}
            data={data}
            setValue={setValue}
        />
    )
}