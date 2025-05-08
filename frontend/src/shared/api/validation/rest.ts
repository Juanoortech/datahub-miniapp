import { ValidationApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";
import {queryParams} from "@/shared/lib/api/queryParams";

export const validationApi: ValidationApi = {
    fetch: async ({ page, type }) =>
        createRequest({
            url: `tasks/validations/completions/${queryParams({
                page,
                internal_type: !type.length ? undefined : type.join(',')
            })}`,
            method: 'GET',
        }),
    fetchExpand: async ({ id }) =>
        createRequest({
            url: `tasks/validations/${id}/`,
            method: 'GET',
        }),
    sendResult: async ({ id, rate }) =>
        createRequest({
            url: `tasks/validations/completions/${id}/`,
            method: 'POST',
            data: {
                score: rate,
            },
        })
}