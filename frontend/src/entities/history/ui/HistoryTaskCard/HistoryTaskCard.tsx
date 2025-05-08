import React from "react";

import { PropsDefault } from "@/shared/lib/types";
import { LazyImage } from "@/shared/ui/LazyImage/LazyImage";
import {Badge, BadgeProps} from "@/shared/ui/Badge";
import { formatDate } from "@/shared/lib/time";
import { Icon, IconProps } from "@/shared/ui";
import {HistoryElementType, TaskState} from "@/shared/api/enums";
import { Stepper, StepperProps } from "@/shared/ui/Stepper";

import { HistoryTaskItem } from '../../model'

import styles from './HistoryTaskCard.module.scss'

export type HistoryTaskCardProps = PropsDefault<HistoryTaskItem>

const iconNameMap: Record<HistoryTaskItem['state'], IconProps['name']> = {
    [TaskState.ACCEPTED]: 'checked-filled',
    [TaskState.REVIEW]: 'clock-filled',
    [TaskState.DECLINED]: 'cancel-filled',
    [TaskState.HOLD]: 'clock-filled',
}

const iconColorMap: Record<HistoryTaskItem['state'], NonNullable<IconProps['view']>> = {
    [TaskState.ACCEPTED]: 'success',
    [TaskState.REVIEW]: 'warning',
    [TaskState.DECLINED]: 'critical',
    [TaskState.HOLD]: 'secondary',
}

const stepperLabelMap: Record<HistoryTaskItem['state'], string> = {
    [TaskState.ACCEPTED]: 'Accepted Reward Sent',
    [TaskState.REVIEW]: 'In Review (Up to 24h)',
    [TaskState.DECLINED]: 'Declined',
    [TaskState.HOLD]: '',
}

const stepperValueMap: Record<HistoryTaskItem['state'], number> = {
    [TaskState.ACCEPTED]: 3,
    [TaskState.REVIEW]: 2,
    [TaskState.DECLINED]: 3,
    [TaskState.HOLD]: 1,
}

const stepperViewMap: Record<HistoryTaskItem['state'], StepperProps['view']> = {
    [TaskState.ACCEPTED]: 'success',
    [TaskState.REVIEW]: 'warning',
    [TaskState.DECLINED]: 'critical',
    [TaskState.HOLD]: 'warning',
}

const badgePropsMap: Record<HistoryTaskItem['type'], BadgeProps> = {
    [HistoryElementType.TASK]: {
        view: 'brand-secondary',
        size: 'xs',
        children: 'Task'
    },
    [HistoryElementType.VALIDATION]: {
        view: 'gray',
        size: 'xs',
        children: 'Validation'
    }
}

const HistoryTaskCardComponent: React.FC<HistoryTaskCardProps> = ({
    className,
    id,
    award,
    title,
    date,
    state,
    img,
    type,
}) => {
    const classes = [
        className ? className : '',
        styles.root,
    ].join(' ').trim()

    return (
        <div className={classes}>
            <div className={styles['image-wrapper']}>
                <Badge 
                    className={styles.badge}
                    size={'m'}
                    view={'brand'}
                    icon={'coin'}
                >
                    {award} Pts
                </Badge>
                <LazyImage 
                    className={styles.image}
                    src={img}
                    alt={`task-history-${id}`}
                    skeletonMinHeight={120}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles['header-inner']}>
                        <p className={styles.date}>{formatDate(date)}</p>
                        <Badge
                            {...badgePropsMap[type]}
                        />
                    </div>
                    <Icon
                        name={iconNameMap[state]}
                        view={iconColorMap[state]}
                        size={20}
                    />
                </div>
                <p className={styles.title}>{title}</p>
                <Stepper 
                    className={styles.stepper}
                    label={stepperLabelMap[state]}
                    view={stepperViewMap[state]}
                    max={3}
                    value={stepperValueMap[state]}
                />
            </div>
        </div>
    )
}

export const HistoryTaskCard = React.memo(HistoryTaskCardComponent)