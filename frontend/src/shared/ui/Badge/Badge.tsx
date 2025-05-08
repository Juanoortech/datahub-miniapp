import React from 'react'

import { PropsDefaultWithChildren } from '@/shared/lib/types'

import { Icon, IconProps } from '../Icon'

import { views, sizes } from './model'
import styles from './Badge.module.scss'

export type BadgeProps = PropsDefaultWithChildren<{
    view?: (typeof views)[number]
    size?: (typeof sizes)[number]
    icon?: IconProps['name']
}>

const iconColorMap: Record<NonNullable<BadgeProps['view']>, IconProps['view']> = {
    default: 'dark',
    brand: 'brand',
    success: 'success',
    critical: 'critical',
    secondary: 'secondary',
    'brand-secondary': 'brand',
    gray: 'dark',
}

const BadgeComponent: React.FC<BadgeProps> = ({
    className,
    view = 'default',
    size = 'm',
    icon,
    children,
}) => {
    const classes = [
        className ? className : '',
        styles.root,
        styles[`size_${size}`],
        styles[`view_${view}`],
    ].join(' ').trim()

    return (
        <div className={classes}>
            {icon && (
                <Icon 
                    className={styles.icon}
                    name={icon}
                    size={20}
                    view={iconColorMap[view]}
                />
            )}    
            <p>{children}</p>
        </div>
    )
}

export const Badge = React.memo(BadgeComponent)