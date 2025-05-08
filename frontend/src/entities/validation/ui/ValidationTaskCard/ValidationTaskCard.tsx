import React from "react"
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {LazyImage} from "@/shared/ui/LazyImage"
import {ButtonIcon} from "@/shared/ui/ButtonIcon"
import {Icon} from "@/shared/ui"
import {toFormattedNumber} from "@/shared/lib/number"

import {ValidationListItem} from "../../model"

import styles from './ValidationTaskCard.module.scss'
import {Badge} from "@/shared/ui/Badge";

export type ValidationTaskCardProps = PropsDefault<{
    task: ValidationListItem
    onClick: (task: ValidationListItem) => void
}>

const ValidationTaskCardComponent: React.FC<ValidationTaskCardProps> = ({
    className,
    task,
    onClick
}) => (
    <div className={clsx(className, styles.root)}>
        <div className={styles['image-wrapper']}>
            <LazyImage
                className={styles.image}
                src={task.image}
                alt={`validation-${task.id}`}
                skeletonMinHeight={120}
            />
        </div>
        <div className={styles.content}>
            <p className={styles.title}>{task.title}</p>
            <div className={styles.bottom}>
                <div className={styles.reward}>
                    <Icon
                        name={'coin'}
                        size={20}
                        view={'brand'}
                    />
                    <p>{toFormattedNumber(task.reward)} Pts</p>
                </div>
                <ButtonIcon
                    view={'brand'}
                    size={'m'}
                    radius={'rounded'}
                    icon={'arrow-right-outline'}
                    onClick={() => onClick(task)}
                />
            </div>
        </div>
    </div>
)

export const ValidationTaskCard = React.memo(ValidationTaskCardComponent)