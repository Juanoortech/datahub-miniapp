import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import styles from './ExpandTaskDetails.module.scss'

export const ExpandTaskDetailsSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <div 
        className={[
            className ? className : '',
            styles.skeleton
        ].join(' ').trim()}
    />
)