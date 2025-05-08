import React from "react"
import { AnimatePresence, motion } from "framer-motion"

export type TransitionExpandProps = React.PropsWithChildren<{
    isShow: boolean
}>

export const TransitionExpand: React.FC<TransitionExpandProps> = ({
    children,
    isShow
}) => (
    <AnimatePresence>
        {isShow && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                        duration: 0.3,
                        height: {
                            delay: 0.3,
                        }
                    },
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { delay: 0.3, duration: 0.3 }
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)
