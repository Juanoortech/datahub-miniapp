'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { PropsDefaultWithChildren } from '@/shared/lib/types'

export type TransitionFadeProps = PropsDefaultWithChildren<{
    rootRef?: React.RefObject<HTMLDivElement>
    duration?: number
    delay?: number
    onScroll?: () => void
}>

const TransitionFadeComponent = ({
    rootRef,
    children,
    className,
    duration = 0.3,
    delay = 0,
    onScroll,
}: TransitionFadeProps) => {
    const childrenList = Array.isArray(children) ? children : [children]

    return (
        <AnimatePresence mode={'wait'} initial={false}>
            {childrenList.map(child => {
                if (!child) return
                const key = child!.key as string
                return (
                    <motion.div
                        ref={rootRef}
                        className={className}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration,
                            delay,
                        }}
                        key={key}
                        onScroll={onScroll}>
                        {child}
                    </motion.div>
                )
            })}
        </AnimatePresence>
    )
}

export const TransitionFade = React.memo(TransitionFadeComponent)
