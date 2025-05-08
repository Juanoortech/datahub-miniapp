import React, { useState } from "react";

import { PropsDefault } from "@/shared/lib/types";

import { TransitionFade } from "../TransitionFade";

import styles from './TabsCardLayout.module.scss'
import {clsx} from "clsx";

export type TabsCardLayoutProps = PropsDefault<{
    state: number
    setState: (value: number) => void
    tabs: string[]
    components: React.ReactNode[]
    isScrollable?: boolean
}>

const TabsCardLayoutComponent: React.FC<TabsCardLayoutProps> = ({
    className,
    state,
    setState,
    tabs,
    components,
    isScrollable = true
}) => {
    return (
        <div className={clsx(
            className,
            styles.root,
            {
                [styles['is-scrollable']]: isScrollable,
            }
        )}>
            <div className={styles.tabs}>
                {tabs.map((item, key) => (
                    <button
                        className={clsx(
                            styles.tab,
                            {
                                [styles['is-active']]: state === key
                            }
                        )}
                        onClick={() => setState(key)}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className={styles.wrapper}>
                <TransitionFade className={styles.fade}>
                    <div
                        key={`state-${state}`}
                        className={styles.inner}
                    >
                        {components[state]}
                    </div>
                </TransitionFade>
            </div>
        </div>
    )
}

export const TabsCardLayout = React.memo(TabsCardLayoutComponent)