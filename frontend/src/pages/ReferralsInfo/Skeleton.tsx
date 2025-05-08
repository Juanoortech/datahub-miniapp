import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"
import {FloatingButtons} from "@/shared/ui/FloatingButtons"
import {ButtonSkeleton} from "@/shared/ui/Button/ButtonSkeleton"

import styles from './ReferralsInfo.module.scss'
import {ReferralTotalTableSkeleton} from "@/widgets/referrals";

export const Skeleton = () => {
    return (
        <div className={styles.root}>
            <SkeletonWrapper>
                <h1 className={styles.title}>Referrals</h1>
                <ReferralTotalTableSkeleton />
            </SkeletonWrapper>
            <FloatingButtons>
                <SkeletonWrapper>
                    <ButtonSkeleton />
                </SkeletonWrapper>
            </FloatingButtons>
        </div>
    )
}