import React from "react"

import { PropsDefaultWithChildren } from "@/shared/lib/types"

import styles from './Card.module.scss'
import {clsx} from "clsx";

export type CardProps = PropsDefaultWithChildren<{
    size?: 's' | 'm'
    view?: 'surface' | 'dark' | 'surface-border' | 'gray' | 'blue-gradient'
    onClick?: () => void
}>

const CardComponent: React.FC<CardProps> = ({
    className,
    size = 's',
    view = 'surface-border',
    children,
    onClick
}) => (
    <div
        className={clsx(
            className,
            styles.root,
            styles[`size_${size}`],
            styles[`view_${view}`]
        )}
        onClick={onClick}
    >
        {children}
    </div>
)

export const Card = React.memo(CardComponent)