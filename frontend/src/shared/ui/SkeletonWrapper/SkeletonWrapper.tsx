import React from "react";

import { PropsDefaultWithChildren } from "@/shared/lib/types";

import styles from './SkeletonWrapper.module.scss'

export const SkeletonWrapper: React.FC<PropsDefaultWithChildren> = ({
    className,
    children,
}) => (
    <div 
        className={[
            className,
            styles.root,
        ].join(' ')}
        style={{
            animationName: styles['skeleton-animation']
        }}
        >
        {children}
    </div>
)