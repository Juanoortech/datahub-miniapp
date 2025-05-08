import {ReferralTotalTable} from "@/widgets/referrals"

import {ReferralModal} from "@/features/referral"

import {FloatingButtons} from "@/shared/ui/FloatingButtons"
import {Button} from "@/shared/ui"
import {useModal} from "@/shared/ui/BottomSheet"

import styles from './ReferralsInfo.module.scss'

export const Content = () => {
    const { isOpen, open, close } = useModal()

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Total Referral Earnings</h1>
            <ReferralTotalTable />
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