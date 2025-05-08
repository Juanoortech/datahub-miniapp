import {
    ReferralEarningsSkeleton,
    ReferralSystemLevelSkeleton,
    ReferralSystemListSkeleton
} from "@/widgets/referrals"

import {SkeletonWrapper} from "@/shared/ui/SkeletonWrapper"
import {FloatingButtons} from "@/shared/ui/FloatingButtons";
import {ButtonSkeleton} from "@/shared/ui/Button/ButtonSkeleton";

import styles from './Referrals.module.scss'

export const Skeleton = () => {
    return (
        <div className={styles.root}>
            <SkeletonWrapper>
                <h1 className={styles.title}>Referrals</h1>
                <ReferralSystemLevelSkeleton />
                <ReferralEarningsSkeleton className={styles.earnings} />
                <ReferralSystemListSkeleton />
            </SkeletonWrapper>
            <FloatingButtons>
                <SkeletonWrapper>
                    <ButtonSkeleton />
                </SkeletonWrapper>
            </FloatingButtons>
        </div>
    )
}