import React, { useEffect } from "react"
import {createPortal} from "react-dom"

import { ReferralModal } from "@/features/referral"

import { useModal } from "@/shared/ui/BottomSheet"
import { icons } from "@/shared/assets/icons"
import { RouterPathes } from "@/shared/lib/types"
import { Button, Icon } from "@/shared/ui"
import { ButtonIcon } from "@/shared/ui/ButtonIcon"

import styles from './TaskResponse.module.scss'

export type TaskResponseProps = {
    award: number
}

const TaskResponseComponent: React.FC<TaskResponseProps> = ({
    award,
}) => {
    const { isOpen, open, close } = useModal()

    useEffect(() => {
        // setHeaderColor('#03277e')
    }, [])

    return createPortal(
        <div className={[
            styles.root,
            styles.container,
        ].join(' ').trim()}>
            <div className={styles.content}>
                <img 
                    src={icons.response}
                    width={140}
                    height={140}
                    alt="response"
                />
                <h2 className={styles.title}>
                    Thank you for your <br /> 
                    contribution! 🎉
                </h2>
                <div className={styles.cell}>
                    <div className={styles['row-between']}>
                        <div className={styles.row}>
                            <Icon 
                                name={'coin'}
                                view={'surface'}
                                size={20}
                            />
                            <p>Reward</p>
                        </div>
                        <p className={styles.reward}>+{award} Points</p>
                    </div>
                    <p className={styles.description}>
                        If the task is completed correctly you will receive your points within 24 hours
                    </p>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button
                    className={styles['button-go']}
                    tag="link"
                    to={RouterPathes.MAIN}
                    view={'surface'}
                >
                    Go to Tasks
                </Button>
                <ButtonIcon 
                    icon={'share-outline'}
                    view={'flat'}
                    size={'l'}
                    radius={'m'}
                    onClick={open}
                />
            </div>
            <ReferralModal 
                isOpen={isOpen}
                setIsOpen={close}
            />
        </div>,
        document.body
    )
}

export const TaskResponse = React.memo(TaskResponseComponent)