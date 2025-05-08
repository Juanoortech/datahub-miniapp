import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import { sizes } from './model'
import styles from './Button.module.scss'

export const ButtonSkeleton: React.FC<PropsDefault<{
    size?: (typeof sizes)[number]
}>> = ({
    className,
    size = 'm'
}) => (
    <div 
        className={[
            className,
            styles.root,
            styles[`view_skeleton`],
            styles[`size_${size}`],
            styles['is-wide'],
        ].join(' ')}
    />
)