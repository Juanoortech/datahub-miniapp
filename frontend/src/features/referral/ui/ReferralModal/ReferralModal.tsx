import React, {useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"

import {AppDispatch, RootState} from "@/app/store"

import {isEmptyViewer, viewerModel} from "@/entities/viewer"

import { BottomSheet } from "@/shared/ui/BottomSheet"
import { TransitionFade } from "@/shared/ui/TransitionFade"
import { SkeletonWrapper } from "@/shared/ui/SkeletonWrapper"
import { ButtonSkeleton } from "@/shared/ui/Button/ButtonSkeleton"
import { Button } from "@/shared/ui"
import {CopyCell} from "@/shared/ui/CopyCell"
import {useToaster} from "@/shared/providers"

import styles from './ReferralModal.module.scss'

export type ReferralModalProps = {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
    isOpen,
    setIsOpen
}) => {
    const {
        isPending,
        data,
        isNeedFetchViewer
    } = useSelector((state: RootState) => ({
        isPending: state.viewer.isPending,
        data: state.viewer.data,
        isNeedFetchViewer: isEmptyViewer(state.viewer.data)
    }))
    const dispatch = useDispatch<AppDispatch>()

    const { toast } = useToaster()

    const ref = useRef<HTMLDivElement | null>(null)

    function onCopy(text: string) {
        const textarea = document.createElement('textarea')

        textarea.value = text;

        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';

        ref.current?.appendChild(textarea);

        textarea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            toast({
                type: 'error',
                text: 'Link copied unsuccessfully. Please, try again'
            })
            return false
        }

        ref.current?.removeChild(textarea);

        toast({
            type: 'success',
            text: 'Link copied successfully'
        })
        return true
    }

    useEffect(() => {
        if (isOpen && isNeedFetchViewer) {
            dispatch(viewerModel.thunks.fetch())
        }
    }, [isOpen, isNeedFetchViewer, dispatch]);

    return (
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <h3 className={styles.title}>
                Share Your Referral Link with Friends and Earn More Points!
            </h3>
            <TransitionFade className={styles.wrapper}>
                {isPending && (
                    <SkeletonWrapper key={'Skeleton'}>
                        <div 
                            className={styles['cell-skeleton']}
                        />
                        <ButtonSkeleton 
                            className={styles['modal-button']}
                        />
                        <ButtonSkeleton 
                            className={styles['modal-button']}
                        />
                    </SkeletonWrapper>
                )}
                {!isPending && (
                    <div ref={ref} key={'Content'}>
                        <CopyCell
                            label={'Your Referral Link'}
                            value={`https://app.oortech.com?startapp=${data.referralCode}`}
                            showedValue={data.referralCode}
                            onCopy={onCopy}
                        />
                        <Button
                            className={styles['modal-button']}
                            isWide={true}
                            view={'surface'}
                            icon={'link'}
                        >
                            Share Link
                        </Button>
                        <Button
                            className={styles['modal-button']}
                            isWide={true}
                            view={'surface'}
                            icon={'add'}
                        >
                            Share in Stories
                        </Button>
                    </div>
                )}
            </TransitionFade>
        </BottomSheet>
    )
}