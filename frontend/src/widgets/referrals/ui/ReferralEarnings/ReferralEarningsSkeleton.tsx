import React from "react"

import {PropsDefault} from "@/shared/lib/types"
import {BalanceSkeleton} from "@/shared/ui/Balance";

export const ReferralEarningsSkeleton: React.FC<PropsDefault> = ({
    className
}) => (
    <BalanceSkeleton
        className={className}
        label={'Referral Earnings'}
    />
)