import {ResponseDefault} from "@/shared/lib/api/createRequest"

export type GenerateTokenResponse = {
    token: string
}

export type GenerateTokenParams = {
    init_data: string
}

export type TokenApi = {
    generateToken: (params: GenerateTokenParams) => Promise<ResponseDefault<GenerateTokenResponse>>
}