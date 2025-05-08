import React from "react"
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom"

import {RootState} from "@/app/store"

import {PropsDefault, RouterPathes} from "@/shared/lib/types"
import {Balance} from "@/shared/ui/Balance"

export const ReferralEarnings: React.FC<PropsDefault> = ({
    className
}) => {
    const navigate = useNavigate()

    const { data } = useSelector((state: RootState) => state.viewer)

    return (
        <Balance
            className={className}
            label={'Referral Earnings'}
            balance={data.referralsBalance}
            onClick={() => navigate(RouterPathes.TOTAL_REFERRALS)}
        />
    )
}