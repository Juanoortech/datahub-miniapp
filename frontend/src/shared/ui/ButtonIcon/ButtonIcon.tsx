import React from "react";
import { Link } from "react-router-dom";

import { PropsDefault } from "@/shared/lib/types";

import { Icon, IconProps } from "../Icon";

import { tags, sizes, radius, views } from './model'
import styles from './ButtonIcon.module.scss'
import clsx from "clsx";

export type ButtonIconProps = PropsDefault<{
    tag?: (typeof tags)[number]
    size?: (typeof sizes)[number]
    radius?: (typeof radius)[number]
    icon: IconProps['name']
    view?: (typeof views)[number]
    to?: string
    isDisabled?: boolean
    onClick?: () => void
}>

const mapIconView: Record<NonNullable<ButtonIconProps['view']>, IconProps['view']> = {
    surface: 'dark',
    flat: 'surface',
    brand: 'surface',
    'flat-dark': 'surface',
    'surface-secondary': 'dark',
}

export const ButtonIconComponent: React.FC<ButtonIconProps> = ({
    tag = 'button',
    size = 'm',
    radius = 'rounded',
    view = 'surface',
    to,
    className,
    icon,
    isDisabled = false,
    onClick
}) => {
    const classes = clsx(
        [
            className,
            styles.root,
            styles[`size_${size}`],
            styles[`radius_${radius}`],
            styles[`view_${view}`],
        ],
        {
            [styles['is-disabled']]: isDisabled,
        }
    )

    if (tag === 'button') {
        return (
            <button
                className={classes}
                disabled={isDisabled}
                onClick={onClick}
            >
                <Icon 
                    name={icon}
                    size={20}
                    view={mapIconView[view]}
                />
            </button>
        )
    }

    return (
        <Link
            className={classes}
            to={to ?? ''}
        >
            <Icon 
                name={icon}
                size={20}
                view={mapIconView[view]}
            />
        </Link>
    )
}

export const ButtonIcon = React.memo(ButtonIconComponent)