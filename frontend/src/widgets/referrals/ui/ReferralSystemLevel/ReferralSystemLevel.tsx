import React from "react"
import {useSelector} from "react-redux"
import {clsx} from "clsx"

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"
import {IconImage, IconImageProps} from "@/shared/ui/IconImage"
import {Icon} from "@/shared/ui"
import {useModal} from "@/shared/ui/BottomSheet";
import {ReferralSystemLevelModal} from "./ReferralSystemLevelModal";

import styles from './ReferralSystemLevel.module.scss'
import {ReferralModal} from "@/features/referral";

export const ReferralSystemLevel: React.FC<PropsDefault> = ({
    className
}) => {
    const { data } = useSelector((state: RootState) => state.viewer)
    const { total } = useSelector((state: RootState) => state.referrals)

    const infoModal = useModal()
    const shareModal = useModal()

    function getIconName(): IconImageProps['name'] {
        switch (data.referralLevel) {
            case 1: return 'referral-level-1'
            case 2: return 'referral-level-2'
            case 3: return 'referral-level-3'
            default: return 'referral-level-1'
        }
    }

    function getReferralsCount(): string {
        switch (data.referralLevel) {
            case 1: return `${total}/5 Referrals`
            case 2: return `${total}/20 Referrals`
            case 3: return `${total}/∞ Referrals`
            default: return `${total}/10 Referrals`
        }
    }

    function getBottomComponent(): React.ReactNode {
        switch (data.referralLevel) {
            case 1:
                return (
                    <>
                        <p className={styles['bottom-text']}>
                            5% of Your Referrals’ Points Lifetime
                        </p>
                        <div className={styles.progress}>
                            <div
                                className={styles['progress-inner']}
                                style={{
                                    width: `calc(100% / 5 * ${total})`
                                }}
                            />
                        </div>
                    </>
                )
            case 2:
                return (
                    <>
                        <p className={styles['bottom-text']}>
                            10% of Your Referrals’ Points Lifetime
                        </p>
                        <div className={styles.progress}>
                            <div
                                className={styles['progress-inner']}
                                style={{
                                    width: `calc(100% / 20 * ${total})`
                                }}
                            />
                        </div>
                    </>
                )
            case 3:
                return (
                    <>
                        <p className={styles['bottom-text']}>
                            15% of Your Referrals’ Points Lifetime
                        </p>
                    </>
                )
            default:
                return (
                    <>
                        <p className={styles['bottom-text']}>
                            5% from each task
                        </p>
                        <div className={styles.progress}>
                            <div
                                className={styles['progress-inner']}
                                style={{
                                    width: `calc(100% / 10 * ${total})`
                                }}
                            />
                        </div>
                    </>
                )
        }
    }

    return (
        <>
            <div className={clsx(className, styles.root)}>
                <IconImage
                    className={styles.image}
                    name={getIconName()}
                    size={80}
                />
                <div className={styles.content}>
                    <div className={styles.row}>
                        <p className={styles.level}>Level {data.referralLevel}</p>
                        <p className={styles.dot}>·</p>
                        <p className={styles['referrals-count']}>{getReferralsCount()}</p>
                        <button
                            className={styles.info}
                            onClick={infoModal.open}
                        >
                            <Icon
                                name={'info-outline'}
                                view={'secondary'}
                                size={20}
                            />
                        </button>
                    </div>
                    {getBottomComponent()}
                </div>
            </div>
            <ReferralSystemLevelModal
                isOpen={infoModal.isOpen}
                setIsOpen={infoModal.close}
                onShare={() => {
                    infoModal.close()
                    shareModal.open()
                }}
            />
            <ReferralModal
                isOpen={shareModal.isOpen}
                setIsOpen={shareModal.close}
            />
        </>
    )
}