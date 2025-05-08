import React, {useEffect} from "react";

import {TimeStamp} from "@/shared/lib/types"
import {BottomSheet} from "@/shared/ui/BottomSheet"
import {Button, Icon} from "@/shared/ui"
import {toFormattedNumber} from "@/shared/lib/number"
import {useTimer} from "@/shared/lib/hooks/useTimer"
import {ChallengeStatus} from "@/shared/api/enums"

import styles from './ChallengeModal.module.scss'
import {TransitionFade} from "@/shared/ui/TransitionFade";
import {Loader} from "@/shared/ui/Loader";
import {clsx} from "clsx";

export type ChallengeModalBaseProps = {
    status: ChallengeStatus
    title: string
    award: number
    moderationTime?: TimeStamp
    buttonText?: string

    isOpen: boolean
    isLoading?: boolean
    isButtonLoading?: boolean

    setIsOpen: (v: boolean) => void
    onClick: () => void
    onTimerEnd?: () => void
}

const ChallengeModalBaseComponent: React.FC<ChallengeModalBaseProps> = ({
    status,
    title,
    award,
    moderationTime = 0,
    buttonText,

    isOpen,
    isLoading = false,
    isButtonLoading = false,

    setIsOpen,
    onClick,
    onTimerEnd
}) => {
    const { hms, setNewTime } = useTimer(
        moderationTime,
        'down',
        onTimerEnd
    )

    const labelRender = () => {
        switch (status) {
            case ChallengeStatus.NOT_STARTED: return null
            case ChallengeStatus.NOT_CLAIMED: return null
            case ChallengeStatus.IN_PROGRESS:
                return (
                    <div className={styles.label}>
                        <p>Challenge under review</p>
                        <Icon
                            name={'clock-filled'}
                            size={20}
                            view={'secondary-light'}
                        />
                    </div>
                )
            case ChallengeStatus.CLAIMED:
                return (
                    <div className={styles.label}>
                        <p>Challenge completed</p>
                        <Icon
                            name={'checked-filled'}
                            size={20}
                            view={'success'}
                        />
                    </div>
                )
        }
    }

    useEffect(() => {
        setNewTime(moderationTime)
    }, [isOpen, moderationTime]);

    return (
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className={clsx(
                styles.wrapper,
                {
                    [styles['is-loading']]: isLoading,
                }
            )}>
                <div className={styles.content}>
                    {labelRender()}
                    <h4 className={styles.title}>{title}</h4>
                    <div className={styles.balance}>
                        <Icon view={'brand'} name={'coin'} size={24} />
                        <p>{toFormattedNumber(award)}</p>
                    </div>
                    {status === ChallengeStatus.IN_PROGRESS && moderationTime && (
                        <p className={styles.moderation}>
                            Wait {hms.h}:{hms.m}:{hms.s} for moderation check to claim the prize
                        </p>
                    )}
                    <Button
                        className={styles.button}
                        isWide={true}
                        isLoading={isButtonLoading}
                        isDisabled={status === ChallengeStatus.IN_PROGRESS}
                        onClick={onClick}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </BottomSheet>
    )
}

export const ChallengeModalBase = React.memo(ChallengeModalBaseComponent)