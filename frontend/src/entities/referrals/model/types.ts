import {TimeStamp} from "@/shared/lib/types";

export type Referral = {
    id: number
    avatar: string
    name: string
    earnings: number
}

export type ReferralTransaction = {
    id: string
    name: string
    date: TimeStamp
    amount: number
}