import { ResponseDefault } from "@/shared/lib/types"

export type FetchBalanceResponse = ResponseDefault<{
    balance: number
}>

export type BalaceApi = {
    fetch: () => Promise<FetchBalanceResponse>
}