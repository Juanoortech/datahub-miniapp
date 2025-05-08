import React from "react";

import { PropsDefault } from "@/shared/lib/types";

import { views } from './model'
import styles from './Stepper.module.scss'

export type StepperProps = PropsDefault<{
    view: (typeof views)[number]
    label: string
    max: number
    value: number
}>

const StepperComponent: React.FC<StepperProps> = ({
    className,
    view,
    value,
    max,
    label,
}) => {
    const classes = [
        className ? className : '',
        styles.root,
        styles[`view_${view}`],
    ].join(' ').trim()

    return (
        <div className={classes}>
            <p className={styles.label}>{label}</p>
            <div className={styles.wrapper}>
                {Array(max).fill(1).map((_, key) => (
                    <div 
                        key={key}
                        style={{
                            width: `calc((100% / ${max}) - 4px)`
                        }}
                        className={[
                            styles.item,
                            key + 1 <= value ? styles['is-active'] : ''
                        ].join(' ').trim()}
                    />
                ))}
            </div>
        </div>
    )
}

export const Stepper = React.memo(StepperComponent)