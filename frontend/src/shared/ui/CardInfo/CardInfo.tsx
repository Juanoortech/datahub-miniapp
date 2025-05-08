import {PropsDefault} from "@/shared/lib/types";
import {Icon, IconProps} from "@/shared/ui";
import React from "react";
import {Card} from "@/shared/ui/Card";

import styles from './CardInfo.module.scss'

export type CardInfoProps = PropsDefault<{
    title: string
    description: string
    icon: IconProps['name']
    onClick?: () => void
}>

const CardInfoComponent: React.FC<CardInfoProps> = ({
    className,
    title,
    description,
    icon,
    onClick
}) => {
    return (
        <Card
            className={className}
            view={'surface'}
            onClick={onClick}
        >
            <div className={styles.wrapper}>
                <Icon
                    name={icon}
                    size={24}
                    view={'brand'}
                />
                <div className={styles.content}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.description}>{description}</p>
                </div>
            </div>
        </Card>
    )
}

export const CardInfo = React.memo(CardInfoComponent)