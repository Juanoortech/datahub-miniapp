import React from "react";

import styles from './FloatingButtons.module.scss'

export const FloatingButtons: React.FC<React.PropsWithChildren<{
    childrenCount?: number
}>> = ({
    children,
    childrenCount = 1,
}) => {
    const isTwoButtons = childrenCount === 2

    const classes = [
        styles.root,
        isTwoButtons ? styles['is-two-buttons'] : styles['is-one-button']
    ].join(' ').trim()

    return (
        <div className={classes}>
            {children}
        </div>
    )
}