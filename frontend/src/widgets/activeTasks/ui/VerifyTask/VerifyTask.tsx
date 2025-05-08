import React from "react"

import styles from './VerifyTask.module.scss'
import { FloatingButtons } from "@/shared/ui/FloatingButtons"

export type VerifyTaskProps = {
    title: string
    description: string
    VerifyComponent: React.ReactNode
    Actions: React.ReactNode
}

const VerifyTaskComponent: React.FC<VerifyTaskProps> = ({
    title,
    description,
    VerifyComponent,
    Actions
}) => {
    return (
        <div>
            <h1 
                className={styles.title}
            >
                {title}
            </h1>
            <p 
                className={styles.description}
            >
                {description}
            </p>
            {VerifyComponent}
            <FloatingButtons
                childrenCount={2}
            >
                {Actions}
            </FloatingButtons>
        </div>
    )
}

export const VerifyTask = React.memo(VerifyTaskComponent)