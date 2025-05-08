import React from "react"
import {useSelector} from "react-redux"

import {RootState} from "@/app/store"

import {TaskType} from "@/shared/api/enums";

import styles from './ValidationHeader.module.scss'

export const ValidationHeader: React.FC<{
    id: number
}> = ({
    id
}) => {
    const {
        pool
    } = useSelector((state: RootState) => state.validationPool)

    if (pool[id].type === TaskType.IMAGE) {
        return (
            <h1 className={styles.root}>
                Image Validation
            </h1>
        )
    }

    if (pool[id].type === TaskType.VIDEO) {
        return (
            <h1 className={styles.root}>
                Video Validation
            </h1>
        )
    }

    return (
        <h1 className={styles.root}>
            Audio Validation
        </h1>
    )
}