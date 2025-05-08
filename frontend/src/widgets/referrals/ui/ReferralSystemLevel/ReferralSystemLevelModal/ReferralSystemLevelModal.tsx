import React from "react"

import {Modal} from "@/shared/ui/Modal"

import styles from './ReferralSystemLevelModal.module.scss'
import {IconImage, IconImageProps} from "@/shared/ui/IconImage";
import {Button} from "@/shared/ui";

const data: {
    image: IconImageProps['name']
    title: string
    info: string
    description: string
}[] = [
    {
        image: 'referral-level-1',
        title: 'Level 1',
        info: '1-5 Referrals',
        description: 'Earn 5% of Your Referrals’ Points Lifetime. Earn one time bonus of 50 points for every referral'
    },
    {
        image: 'referral-level-2',
        title: 'Level 2',
        info: '6-20 Referrals',
        description: 'Earn 10% of Your Referrals’ Points Lifetime. Earn one time bonus of 100 points for every referral'
    },
    {
        image: 'referral-level-3',
        title: 'Level 3',
        info: '21+ Referrals',
        description: 'Earn 15% of Your Referrals’ Points Lifetime. Earn one time bonus of 150 points for every referral'
    }
]

export const ReferralSystemLevelModal: React.FC<{
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    onShare: () => void
}> = ({
    isOpen,
    setIsOpen,
    onShare,
}) => {
    return (
        <Modal
            title={'Referral System'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <p className={styles.description}>
                Earn up of your referrals’ rewards for each task that they complete successfully. As soon as the task is approved, you will receive a reward.
            </p>
            {data.map(item => (
                <div className={styles.level}>
                    <div className={styles['level-header']}>
                        <IconImage
                            name={item.image}
                            size={24}
                        />
                        <p className={styles.title}>{item.title}</p>
                        <p className={styles.dot}>·</p>
                        <p className={styles.info}>{item.info}</p>
                    </div>
                    <p className={styles['level-description']}>{item.description}</p>
                </div>
            ))}
            <Button
                className={styles['share-button']}
                view={'brand'}
                isWide={true}
                onClick={onShare}
            >
                Share
            </Button>
        </Modal>
    )
}