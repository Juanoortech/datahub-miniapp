import React from "react"
import {useSelector} from "react-redux"

import {RootState} from "@/app/store"

import styles from './ValidationDetails.module.scss'

export const ValidationDetails: React.FC<{
    id: number
}> = ({
    id
}) => {
    const {
        pool
    } = useSelector((state: RootState) => state.validationPool)

    return (
        <div className={styles.root}>
            <p className={styles.title}>Task Details</p>
            <p className={styles.description}>{pool[id].details}</p>
        </div>
    )
}