import React from "react"

import { PropsDefaultWithChildren} from "@/shared/lib/types"
import {Icon, IconProps} from "@/shared/ui"
import {Card} from "@/shared/ui/Card"

import styles from './CardInfoIconView.module.scss'
import {clsx} from "clsx";

export type CardInfoIconViewProps = PropsDefaultWithChildren<{
    icon: IconProps['name']
    view?: 'surface' | 'dark'
    onClick?: () => void
}>

const CardInfoIconViewComponent: React.FC<CardInfoIconViewProps> = ({
    className,
    children,
    icon,
    view = 'surface',
    onClick
}) => {
    return (
        <Card
            className={className}
            view={view === 'surface' ? 'surface-border' : 'dark'}
            size={'s'}
            onClick={onClick}
        >
            <div className={clsx(styles.root, styles[`view_${view}`])}>
                <div className={styles['icon-view']}>
                    <Icon
                        name={icon}
                        size={16}
                        view={view === 'surface' ? 'brand' : 'surface'}
                    />
                </div>
                <p className={styles.title}>{children}</p>
            </div>
        </Card>
    )
}

export const CardInfoIconView = React.memo(CardInfoIconViewComponent)