import {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"


import {validateResultModel} from "@/features/validation"

import {validationPoolModel} from "@/entities/validation"

import {PageLayout} from "@/shared/ui/PageLayout"
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"

import {
    ValidationData,
    ValidationDataSkeleton,
    ValidationHeader,
    ValidationHeaderSkeleton,
    ValidationDetails,
    ValidationDetailsSkeleton,
    ValidationRate,
    ValidationRateSkeleton,
    ValidationSubmit,
    ValidationSubmitSkeleton,
} from './ui'

import {useBackButton} from "@/shared/providers";

export const Validation = () => {
    const params = useParams()
    const { show } = useBackButton()

    const {
        pool,
        isPending,
    } = useSelector((state: RootState) => state.validationPool)
    useSelector((state: RootState) => state.validationResult)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        show()
        dispatch(validationPoolModel.thunks.fetch({
            id: Number(params.id),
        }))

        return () => {
            dispatch(validationPoolModel.actions.reset())
            dispatch(validateResultModel.actions.reset())
        }
    }, [dispatch, params.id, show]);

    return (
        <PageLayout
            isLoading={isPending || !pool[Number(params.id)]}
            Content={isPending ? <SkeletonWrapper><ValidationHeaderSkeleton /><ValidationDataSkeleton /><ValidationDetailsSkeleton /><ValidationRateSkeleton /><ValidationSubmitSkeleton /></SkeletonWrapper> : <><ValidationHeader id={Number(params.id)} /><ValidationData id={Number(params.id)} /><ValidationDetails id={Number(params.id)} /><ValidationRate id={Number(params.id)} /><ValidationSubmit id={Number(params.id)} /></>} Skeleton={undefined}        />
    )
}