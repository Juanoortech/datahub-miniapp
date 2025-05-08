import React, { useEffect } from 'react'
import { HandySvg } from 'handy-svg'

import { icons } from '@/shared/assets/icons'
import { PropsDefault } from '@/shared/lib/types'

import { views, names } from './model'
import styles from './Icon.module.scss'

export type IconProps = PropsDefault<{
    name: (typeof names)[number]
    size: number
    view?: (typeof views)[number]
}>

export const Icon: React.FC<IconProps> = ({
    className,
    name,
    size,
    view = 'surface'
}) => {
    return (
        <HandySvg 
            className={[
                className,
                styles.root,
                styles[`view_${view}`]
            ].join(' ').trim()}
            src={icons[name]}
            alt={`icon-${name}`}
            width={size}
            height={size}
        />
    )
}