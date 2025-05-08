import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums";
import {TimeStamp} from "@/shared/lib/types";

export type TransactionBase = {
    id: string,
    date: TimeStamp
    amount: number
}

export type TransactionWithdraw = {
    type: TransactionType.WITHDRAW,
    withdrawStatus: WithdrawStatus,
}

export type TransactionEarnings = {
    type: TransactionType.EARNINGS,
    earningsType: EarningsType,
    referralName?: string | null
}

export type TransactionItem = TransactionBase & (
    TransactionWithdraw | TransactionEarnings
)

export type TransactionGroup = {
    date: TimeStamp
    items: TransactionItem[]
}