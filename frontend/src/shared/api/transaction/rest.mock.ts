import {GetTransactionsListResponse, TransactionApi} from './types'
import {delay} from "@/shared/lib/time";
import {getRandomInt} from "@/shared/lib/number";
import {EarningsType, TransactionType, WithdrawStatus} from "@/shared/api/enums";

export const transactionApi: TransactionApi = {
    fetch: async ({ page, transactionType, earningType, withdrawStatus }) => {
        await delay()

        function getType() {
            if (transactionType) {
                return transactionType[getRandomInt(0, 1)]
            }

            return !!getRandomInt(0, 1) ? TransactionType.WITHDRAW : TransactionType.EARNINGS
        }

        function getWithdrawStatus(type: TransactionType) {
            if (type === TransactionType.EARNINGS) {
                return null
            }

            if (withdrawStatus) {
                return withdrawStatus[getRandomInt(0, 2)]
            }

            return [
                WithdrawStatus.CONFIRMED,
                WithdrawStatus.PENDING,
                WithdrawStatus.REJECTED
            ][getRandomInt(0, 2)]
        }

        function getEarningType(type: TransactionType) {
            if (type === TransactionType.WITHDRAW) {
                return null
            }

            if (earningType) {
                return earningType[getRandomInt(0, 1)]
            }

            return [
                EarningsType.TASK,
                EarningsType.REFERRAL
            ][getRandomInt(0, 1)]
        }

        function getReferralName(earningType: EarningsType | null) {
            if (earningType === EarningsType.REFERRAL) {
                return 'Name Name'
            }

            return ''
        }

        function getList(): GetTransactionsListResponse['items'] {
            return Array(10).fill(1).map((_, key) => {
                const currDate = new Date()
                if (key < 5) {
                    currDate.setDate(currDate.getDate() - (page - 1))
                } else {
                    currDate.setDate(currDate.getDate() - (page - 1) - 1)
                }
                const type = getType()
                const earningsType = getEarningType(type)

                return {
                    date_and_time: currDate.toUTCString(),
                    internal_type: type,
                    status: getWithdrawStatus(type),
                    type_of_deposit: earningsType,
                    sum_of_transaction: 100,
                    from_user: {
                        name: getReferralName(earningsType),
                    }
                }
            })
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page,
                last_page: 3,
                total: 30,
            }
        }
    }
}