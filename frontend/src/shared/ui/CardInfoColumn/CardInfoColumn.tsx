import React from "react"

import {PropsDefault} from "@/shared/lib/types"
import {Icon, IconProps} from "@/shared/ui"
import {Card} from "@/shared/ui/Card"

import styles from './CardInfo.module.scss'

export type CardInfoColumnProps = PropsDefault<{
    icon: IconProps['name']
    title: string
    description: string
}>

const CardInfoColumnComponent: React.FC<CardInfoColumnProps> = ({
    className,
    icon,
    title,
    description
}) => (
    <Card>
        <Icon
            name={icon}
            size={20}
            view={'brand'}
        />
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
    </Card>
)

export const CardInfoColumn = React.memo(CardInfoColumnComponent)