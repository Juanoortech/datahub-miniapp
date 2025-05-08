import {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {TaskResponse} from "@/widgets/activeTasks"

import {validateResultModel} from "@/features/validation"

import {validationPoolModel} from "@/entities/validation"

import {PageLayout} from "@/shared/ui/PageLayout"
import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"
import {useTelegram} from "@/shared/lib/hooks/useTelegram"
import {TransitionFade} from "@/shared/ui/TransitionFade"

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

import styles from './Validation.module.scss'
import {useBackButton} from "@/shared/providers";

export const Validation = () => {
    const params = useParams()
    const { show } = useBackButton()

    const {
        pool,
        isPending,
    } = useSelector((state: RootState) => state.validationPool)
    const {
        isSuccess,
    } = useSelector((state: RootState) => state.validationResult)
    const dispatch = useDispatch<AppDispatch>()

    const { setHeaderColor } = useTelegram()

    useEffect(() => {
        setHeaderColor('#f7f7f8')
        show()
        dispatch(validationPoolModel.thunks.fetch({
            id: Number(params.id),
        }))

        return () => {
            dispatch(validationPoolModel.actions.reset())
            dispatch(validateResultModel.actions.reset())
        }
    }, []);

    return (
        <PageLayout
            isLoading={isPending || !pool[Number(params.id)]}
            Content={(
                <TransitionFade>
                    {!isSuccess && (
                        <div key={'Content'}>
                            <ValidationHeader
                                id={Number(params.id)}
                            />
                            <ValidationData
                                id={Number(params.id)}
                            />
                            <ValidationDetails
                                id={Number(params.id)}
                            />
                            <ValidationRate
                                id={Number(params.id)}
                            />
                            <ValidationSubmit
                                id={Number(params.id)}
                            />
                        </div>
                    )}
                    {isSuccess && (
                        <TaskResponse
                            key={'Success'}
                            award={pool[Number(params.id)].reward}
                        />
                    )}
                </TransitionFade>
            )}
            Skeleton={(
                <SkeletonWrapper className={styles.skeleton}>
                    <ValidationHeaderSkeleton />
                    <ValidationDataSkeleton />
                    <ValidationDetailsSkeleton />
                    <ValidationRateSkeleton />
                    <ValidationSubmitSkeleton />
                </SkeletonWrapper>
            )}
        />
    )
}