import {Tabs, TabsProps} from "@/shared/ui/Tabs";
import {TaskType} from "@/shared/api/enums";
import React from "react";
import {PropsDefault} from "@/shared/lib/types";

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

export type TaskTypeFilterProps = PropsDefault<{
    value: TaskType[]
    setValue: (v: TaskType[]) => void
}>

const TaskTypeFilterComponent: React.FC<TaskTypeFilterProps> = ({
    className,
    value,
    setValue
}) => (
    <Tabs
        className={className}
        value={!value.length ? ['all'] : value}
        data={data}
        setArrayValue={v => {
            if (v.includes('all')) {
                if (!value.length) {
                    setValue(v.filter(item => item !== 'all') as TaskType[])
                    return
                }

                setValue([])
                return
            }

            if (v.length === 3) {
                setValue([])
                return
            }

            setValue(v as TaskType[])
        }}
    />
)

export const TaskTypeFilter = React.memo(TaskTypeFilterComponent)