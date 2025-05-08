import React from "react";
import { AnimatePresence, motion } from 'framer-motion'

import { PropsDefault } from "@/shared/lib/types";

import { Icon, IconProps } from "../Icon";

import styles from './Tabs.module.scss'
import {clsx} from "clsx";

export type TabsProps = PropsDefault<{
    value: (number | string)[]
    view?: 'default' | 'surface'
    isDisabled?: boolean
    data: {
        id: number | string
        icon?: IconProps['name']
        iconColor?: IconProps['view']
        text: string
    }[]
    setValue?: (v: number | string) => void
    setArrayValue?: (v: (number | string)[]) => void
}>

const TabsComponent: React.FC<TabsProps> = ({
    className,
    value,
    data,
    view = 'default',
    isDisabled = false,
    setValue,
    setArrayValue,
}) => {
    const classes = clsx(
        className,
        styles.root,
        styles[`view_${view}`]
    )

    function getItemClasses(isActive: boolean) {
        const result = [
            styles.item
        ]

        if (isActive) {
            result.push(styles['is-active'])
        }

        return result.join(' ').trim()
    }

    function isActive(id: number | string) {
        return value.includes(id) 
    }

    function onClick(id: number | string) {
        if (value.includes(id)) {
            const copy = value.filter(item => item !== id)
            setArrayValue?.(copy)
        } else {
            setArrayValue?.([
                ...value,
                id,
            ])
        }
        setValue?.(id)
    }

    return (
        <div className={classes}>
            {data.map(item => (
                <button
                    key={item.id}
                    className={getItemClasses(isActive(item.id))}
                    disabled={isDisabled}
                    onClick={() => onClick(item.id)}
                >
                    {item.icon && (
                        <Icon 
                            className={styles.icon}
                            name={item.icon}
                            view={item.iconColor}
                            size={20}
                        />
                    )}
                    <p>{item.text}</p>
                    <AnimatePresence>
                        {isActive(item.id) && (
                            <motion.div
                                initial={{
                                    width: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    width: 'auto',
                                    opacity: 1,
                                }}
                                exit={{
                                    width: 0,
                                    opacity: 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}>
                                <Icon 
                                    key={'isActive'}
                                    name={'checked'}
                                    view={'brand'}
                                    size={16}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            ))}
        </div>
    )
}

export const Tabs = React.memo(TabsComponent)