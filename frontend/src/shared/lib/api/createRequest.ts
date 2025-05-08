import {tokenModel} from "@/shared/model";
import {IS_LOCAL} from "@/shared/app-state";

export type SuccessResponse<T> = {
    error: false,
    payload: T
}

export type FailureResponse = {
    error: true,
    payload: null
}

export type ResponseDefault<T> = SuccessResponse<T> | FailureResponse

const urlMap: Record<'local' | 'dev' | 'demo' | 'prod', string> = {
    local: 'http://localhost:8000/api/v1/',
    dev: 'https://oort-test.solid-dev1.ru/api/v1/',
    demo: `https://oort-demo.solid-dev1.ru/api/v1/`,
    prod: `https://datahub-miniapp.oortech.com/api/v1/`,
}

export async function createRequest<T>({
    withAuth = true,
    ...data
}: {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
    data?: Record<string, unknown>,
    withAuth?: boolean
}): Promise<ResponseDefault<T>> {
    try {
        const token = tokenModel.getToken()

        console.log(token)

        if (!token && withAuth) {
            const { error } = await tokenModel.updateToken()

            if (!error) {
                return createRequest<T>({
                    withAuth: true,
                    ...data,
                })
            }
        }

        const url = `${urlMap[IS_LOCAL]}${data.url}`

        const response = await fetch(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(data.method === 'GET' && data.data && {
                        'Content-Length': JSON.stringify(data.data).length.toString()
                    }),
                    ...(withAuth && {
                        Authorization: `${token}`,
                    }),
                },
                method: data.method,
                ...(data.data && {
                    body: JSON.stringify(data.data)
                })
            }
        )

        const payload = await response.json()

        if (response.ok) {
            return {
                error: false,
                payload,
            }
        }

        if (response.status === 401) {
            const { error } = await tokenModel.updateToken()

            if (!error) {
                return createRequest<T>({
                    withAuth: true,
                    ...data,
                })
            }
        }

        return {
            error: true,
            payload: null
        }
    } catch (e) {
        console.log(e)
        return {
            error: true,
            payload: null
        }
    }
}