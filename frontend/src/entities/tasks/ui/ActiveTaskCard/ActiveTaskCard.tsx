import React from "react"

import { PropsDefault } from "@/shared/lib/types"
import { LazyImage } from "@/shared/ui/LazyImage/LazyImage"
import { Badge, BadgeProps } from "@/shared/ui/Badge"
import { InfoCell } from "@/shared/ui/InfoCell/InfoCell"
import { formatTime } from '@/shared/lib/time'
import { ButtonIcon } from "@/shared/ui/ButtonIcon/ButtonIcon"
import { TaskType } from "@/shared/api/enums"

import { getTaskTypeText, ActiveTaskItem } from "../../model"

import styles from './ActiveTaskCard.module.scss'

export type ActiveTaskCardProps = PropsDefault<ActiveTaskItem & {
    onClick: (id: number) => void
}>

const taskTypeIconMap: Record<TaskType, BadgeProps['icon']> = {
    [TaskType.AUDIO]: 'audio-outline',
    [TaskType.IMAGE]: 'image',
    [TaskType.VIDEO]: 'video-outline',
}

const ActiveTaskCardComponent: React.FC<ActiveTaskCardProps> = ({
    className,
    id,
    type,
    img,
    title,
    description,
    price,
    time,
    onClick
}) => {
    const classes = [
        className ? className : '',
        styles.root
    ].join(' ').trim()

    return (
        <div className={classes}>
            <div className={styles['image-wrapper']}>
                <Badge 
                    className={styles.type}
                    size={'l'}
                    view={'default'}
                    icon={taskTypeIconMap[type]}
                >
                    {getTaskTypeText(type)}
                </Badge>
                <LazyImage 
                    className={styles.image}
                    src={img}
                    alt={`${title} image`}
                    skeletonMinHeight={200}
                />
            </div>
            <div className={styles.content}>
                <div className={styles['header-wrapper']}>
                    <h3 className={styles.title}>{title}</h3>
                </div>
                <p className={styles.description}>{description}</p>
                <div className={styles.bottom}>
                    <div className={styles.inner}>
                        <InfoCell 
                            view="brand"
                            icon={'coin'}
                            title={`${price} Pts`}
                        />
                        <div 
                            className={styles.divider}
                        />
                        <InfoCell 
                            view="secondary"
                            icon={'clock'}
                            title={formatTime(time)}
                        />
                    </div>
                    <ButtonIcon 
                        view={'brand'}
                        size={'m'}
                        radius={'rounded'}
                        icon={'arrow-right-outline'}
                        onClick={() => onClick(id)}
                    />
                </div>
            </div>
        </div>
    )
}

export const ActiveTaskCard = React.memo(ActiveTaskCardComponent)