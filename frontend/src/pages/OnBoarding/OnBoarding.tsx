import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion, useAnimation } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { AppDispatch } from '@/app/store'

import { viewerModel } from '@/entities/viewer'

import { ButtonIcon } from '@/shared/ui/ButtonIcon'
import { Icon } from '@/shared/ui'
import { useTabBarContext } from '@/shared/lib/providers'
import { TransitionFade } from '@/shared/ui/TransitionFade'
import { images } from '@/shared/assets/images'
import { RouterPathes } from '@/shared/lib/types'

import styles from './OnBoarding.module.scss'
import {LazyImage} from "@/shared/ui/LazyImage";
import {createPortal} from "react-dom";

enum Step {
    FIRST,
    SECOND,
}

export const OnBoarding = () => {
    const navigate = useNavigate()

    const { hide, show } = useTabBarContext()

    const dispatch = useDispatch<AppDispatch>()

    const [step, setStep] = useState(Step.FIRST)

    useEffect(() => {
        hide()

        return () => {
            show()
        }
    }, [])

    function onSubmit() {
        dispatch(viewerModel.thunks.completeOnBoarding())
        dispatch(viewerModel.actions.completeOnBoarding())
        navigate(RouterPathes.MAIN)
    }

    return createPortal(
        <div className={styles.root}>
            <Stepper 
                value={step}
            />
            <TransitionFade>
                {step === Step.FIRST && (
                    <StepElement 
                        key={'First'}
                        img={'/assets/on-boarding/first.png'}
                        title={'Building People’s AI with Traceable, Verified Data Gathered Globally'}
                        description={'Turn your free time into real rewards! Complete fun, simple tasks directly in Telegram—no sign-up needed. Earn points, climb the leaderboard, and win USDT rewards and exclusive merchandise. It’s fast, easy, and designed for everyone!'}
                    />
                )}
                {step === Step.SECOND && (
                    <StepElement 
                        key={'Second'}
                        img={'/assets/on-boarding/second.png'}
                        title={'Level Up with the DataHub App on iOS and Android'}
                        description={'Level up with the DataHub App! Unlock bigger rewards, advanced features, and manage your contributions effortlessly. Join the global movement shaping AI and earn in exciting new ways.'}
                    />
                )}
            </TransitionFade>
            <Buttons
                value={step}
                onBack={() => setStep(Step.FIRST)}
                onNext={() => setStep(Step.SECOND)}
                onSubmit={onSubmit}
            />
        </div>,
        document.body,
    )
}

const Stepper: React.FC<{
    value: Step
}> = ({
    value,
}) => (
    <div className={styles.stepper}>
        <div 
            className={clsx(
                styles['stepper-item'],
                styles['is-active'],
            )} 
        />
        <div 
            className={clsx(
                styles['stepper-item'],
                {
                    [styles['is-active']]: value === Step.SECOND,
                }
            )} 
        />
    </div>
)

const Buttons: React.FC<{
    value: Step,
    onBack: () => void
    onNext: () => void
    onSubmit: () => void
}> = ({
    value,
    onBack,
    onNext,
    onSubmit
}) => {
    const controls = useAnimation();

    useEffect(() => {
        if (value === Step.FIRST) {
            controls.start({
                width: '0px',
                paddingRight: '0px',
                opacity: 0,
                transition: { 
                    width: {
                        duration: 0.3,
                        delay: 0.3,
                    },
                    opacity: {
                        duration: 0.3,
                    }
                },
            })
        } else {
            controls.start({
                width: '118px',
                paddingRight: '6px',
                opacity: 1,
                transition: { 
                    width: {
                        duration: 0.3,
                    },
                    opacity: {
                        duration: 0.3,
                        delay: 0.3,
                    }
                },
            })
        }
    }, [value])

    return (
        <div className={styles.buttons}>
            <ButtonIcon 
                icon={'arrow-left-outline'}
                view={'surface-secondary'}
                isDisabled={value === Step.FIRST}
                onClick={onBack}
            />
            <button 
                className={styles['next-button']}
                onClick={() => {
                    if (value === Step.FIRST) {
                        onNext()
                        return
                    }

                    onSubmit()
                    return
                }}
            >
                <motion.p
                    animate={controls}
                >
                    Start Your Journey
                </motion.p>
                <Icon 
                    name={'arrow-right-outline'}
                    view={'surface'}
                    size={20}
                />
            </button>
        </div>
    )
}

const StepElement: React.FC<{
    img: string
    title: string
    description: string
}> = ({
    img,
    title,
    description
}) => (
    <div className={styles['step-element']}>
        <img
            className={styles.img}
            src={img}
            alt='decor'
        />
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
    </div>
)