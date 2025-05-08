import React from "react";
import { Link } from "react-router-dom";

import { PropsDefaultWithChildren } from "@/shared/lib/types";

import { TransitionFade } from "../TransitionFade";
import { Loader, LoaderProps } from "../Loader";

import { tags, views, sizes } from './model'
import styles from './Button.module.scss'
import { Icon, IconProps } from "../Icon";

export type ButtonProps = PropsDefaultWithChildren<{
    tag?: (typeof tags)[number],
    view?: (typeof views)[number],
    size?: (typeof sizes)[number],
    to?: string,
    icon?: IconProps['name'],
    isWide?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean
    onClick?: () => void,
}>

const loaderColorMap: Record<NonNullable<ButtonProps['view']>, LoaderProps['color']> = {
    brand: 'white',
    critical: 'white',
    surface: 'black',
    'surface-light': 'white',
    'surface-critical': 'critical',
}

const iconViewMap: Record<NonNullable<ButtonProps['view']>, IconProps['view']> = {
    brand: 'surface',
    critical: 'surface',
    surface: 'dark',
    'surface-light': 'surface',
    'surface-critical': 'critical',
}

const ButtonComponent: React.FC<ButtonProps> = ({
    className,
    tag = 'button',
    to,
    view = 'brand',
    size = 'm',
    children,
    icon,
    isWide = false,
    isLoading = false,
    isDisabled = false,
    onClick
}) => {
    const classes = [
        className ? className : '',
        isLoading ? styles['is-loading'] : '',
        styles.root,
        styles[`view_${view}`],
        styles[`size_${size}`],
        isWide ? styles['is-wide'] : '',
        isDisabled ? styles['is-disabled'] : '',
    ].join(' ')

    return (
        <Wrapper
            tag={tag}
            className={classes}
            to={to}
            isDisabled={isLoading || isDisabled}
            onClick={onClick}
        >
            <TransitionFade className={styles.loader}>
                {isLoading && (
                    <Loader 
                        size={'s'}
                        color={loaderColorMap[view]}
                    />
                )}
            </TransitionFade>
            <div className={styles.content}>
                {icon && (
                    <Icon 
                        className={styles.icon}
                        name={icon}
                        size={20}
                        view={iconViewMap[view]}
                    />
                )}
                {children}
            </div>
        </Wrapper>
    )
}

const Wrapper: React.FC<Pick<ButtonProps, 'tag' | 'className' | 'onClick' | 'to' | 'children'> & {
    isDisabled?: boolean
}> = ({
     tag,
     className,
     to,
     onClick,
     children,
     isDisabled = false,
 }) => {
    if  (tag === 'button') {
        return (
            <button
                disabled={isDisabled}
                className={className}
                onClick={onClick}
            >
                {children}
            </button>
        )
    }

    return (
        <Link
            className={className}
            to={to ?? ''}
        >
            {children}
        </Link>
    )
}

export const Button = React.memo(ButtonComponent)