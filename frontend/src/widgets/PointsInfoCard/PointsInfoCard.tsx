import React from "react"
import {clsx} from "clsx"
import { useNavigate } from "react-router-dom"

import {PropsDefault, RouterPathes} from "@/shared/lib/types"
import {CardInfo} from "@/shared/ui/CardInfo"

import styles from './PointsInfoCard.module.scss'

export type PointsInfoCardProps = PropsDefault

export const PointsInfoCard: React.FC<PointsInfoCardProps> = ({
    className
}) => {
    const navigate = useNavigate()

    return (
        <CardInfo
            className={clsx(styles.root, className)}
            icon={'diamond'}
            title={'How to use Points?'}
            description={'Learn more about our point system'}
            onClick={() => {
                navigate(RouterPathes.POINTS)
            }}
        />
    )
}