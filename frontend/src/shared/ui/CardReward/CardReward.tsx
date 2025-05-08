import React from "react"

import {PropsDefault} from "@/shared/lib/types"
import {IconImage, IconImageProps} from "@/shared/ui/IconImage"
import {Card, CardProps} from "@/shared/ui/Card"

import styles from './CardReward.module.scss'
import {clsx} from "clsx";

export type CardRewardsProps = PropsDefault<{
    view: 'dark' | 'surface'
    title: string
    list: {
        icon: IconImageProps['name'],
        text: React.ReactNode,
    }[]
}>

const mapView: Record<CardRewardsProps['view'], CardProps['view']> = {
    dark: 'blue-gradient',
    surface: 'surface-border',
}

const CardRewardComponent: React.FC<CardRewardsProps> = ({
    className,
    view,
    title,
    list,
}) => {
    return (
        <Card
            className={clsx(
                className,
                styles[`view_${view}`],
            )}
            view={mapView[view]}
            size={'s'}
        >
            <p className={styles.title}>{title}</p>
            {list.map((item, key) => (
                <div key={key} className={styles.item}>
                    <IconImage
                        name={item.icon}
                        size={24}
                    />
                    {item.text}
                </div>
            ))}
        </Card>
    )
}

export const CardReward = React.memo(CardRewardComponent)