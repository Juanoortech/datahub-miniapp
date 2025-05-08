import React from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {validateResultModel} from "@/features/validation"

import {Button} from "@/shared/ui"

import { data } from './model'
import styles from './ValidationRate.module.scss'

export const ValidationRate: React.FC<{
    id: number
}> = () => {
    const { rate } = useSelector((state: RootState) => state.validationResult)
    const dispatch = useDispatch<AppDispatch>()

    function onClick(v: number) {
        dispatch(validateResultModel.actions.setRate(v))
    }

    return (
        <div className={styles.root}>
            <p className={styles.title}>Rate how this task was done?</p>
            <div className={styles.row}>
                {data.map(item => (
                    <div className={styles.item}>
                        <p className={styles.smile}>{item.smile}</p>
                        <Button
                            isWide={true}
                            view={rate === item.rate ? 'brand' : 'surface'}
                            onClick={() => onClick(item.rate)}
                        >
                            {item.rate}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}