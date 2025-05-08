import {
    ReferralEarnings,
    ReferralSystemList
} from "@/widgets/referrals"
import {ReferralSystemLevel} from '@/widgets/referrals/ui/ReferralSystemLevel'

import {ReferralModal} from "@/features/referral"

import {FloatingButtons} from "@/shared/ui/FloatingButtons"
import {Button} from "@/shared/ui"
import {useModal} from "@/shared/ui/BottomSheet"

import styles from './Referrals.module.scss'

export const Content = () => {
    const { isOpen, open, close } = useModal()

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Referrals</h1>
            <ReferralSystemLevel />
            <ReferralEarnings className={styles.earnings} />
            <ReferralSystemList />
            <FloatingButtons>
                <Button
                    view={'brand'}
                    isWide={true}
                    onClick={open}
                >
                    Share
                </Button>
            </FloatingButtons>
            <ReferralModal
                isOpen={isOpen}
                setIsOpen={close}
            />
        </div>
    )
}