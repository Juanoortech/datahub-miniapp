import React from 'react'
import {clsx} from "clsx"

import {PropsDefault} from "@/shared/lib/types"
import {Icon, IconProps} from "@/shared/ui"
import {toFormattedNumber} from "@/shared/lib/number"
import {LazyImage} from "@/shared/ui/LazyImage"

import styles from './ChallengeCard.module.scss'
import {ChallengeStatus} from "@/shared/api/enums";

export type ChallengeCardBaseProps = PropsDefault<{
    img: string
    title: string
    award: number
    status: ChallengeStatus
    onClick: () => void
}>

const iconMap: Record<ChallengeStatus, IconProps['name'] | null> = {
    [ChallengeStatus.NOT_STARTED]: null,
    [ChallengeStatus.IN_PROGRESS]: 'clock-filled',
    [ChallengeStatus.NOT_CLAIMED]: 'clock-filled',
    [ChallengeStatus.CLAIMED]: 'checked-filled',
}

const iconColorMap: Record<ChallengeStatus, IconProps['view'] | undefined> = {
    [ChallengeStatus.NOT_STARTED]: undefined,
    [ChallengeStatus.IN_PROGRESS]: 'secondary-light',
    [ChallengeStatus.NOT_CLAIMED]: 'secondary-light',
    [ChallengeStatus.CLAIMED]: 'success',
}

export const ChallengeCardBase: React.FC<ChallengeCardBaseProps> = ({
    className,
    img,
    title,
    award,
    status,
    onClick
}) => {
    const icon = iconMap[status]
    const iconColor = iconColorMap[status]

    return (
        <div
            className={clsx(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.row}>
                <div className={styles['avatar-wrapper']}>
                    <LazyImage
                        className={styles.avatar}
                        src={img}
                        alt={'challenge image'}
                        skeletonMinHeight={48}
                    />
                </div>
                <div>
                    <div className={styles.row}>
                        <p className={styles.title}>{title}</p>
                        {icon && (
                            <Icon
                                name={icon}
                                view={iconColor}
                                size={20}
                            />
                        )}
                    </div>
                    <div className={styles.award}>
                        <Icon
                            view={'brand'}
                            name={'coin'}
                            size={16}
                        />
                        <p>{toFormattedNumber(award)} Pts</p>
                    </div>
                </div>
            </div>
            <Icon
                name={'chevron-right-outline'}
                size={24}
                view={'dark'}
            />
        </div>
    )
}