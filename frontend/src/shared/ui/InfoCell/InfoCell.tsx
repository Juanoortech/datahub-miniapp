import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import { Icon, IconProps } from "../Icon";

import { views } from './model'
import styles from './InfoCell.module.scss'

export type InfoCellProps = PropsDefault<{
    icon: IconProps['name']
    title: string
    view?: (typeof views)[number]
}>

const iconColorMap: Record<NonNullable<InfoCellProps['view']>, IconProps['view']> = {
    secondary: 'secondary',
    brand: 'brand',
}

const InfoCellComponent: React.FC<InfoCellProps> = ({
    className,
    icon,
    title,
    view = 'secondary'
}) => {
    const classes = [
        className ? className : '',
        styles.root,
        styles[`view_${view}`],

    ].join(' ').trim()

    return (
        <div className={classes}>
            <Icon 
                className={styles.icon}
                name={icon}
                view={iconColorMap[view]}
                size={20}
            />
            <p>{title}</p>
        </div>
    )
}

export const InfoCell = React.memo(InfoCellComponent)