import {createRequest} from "@/shared/lib/api/createRequest"
import {queryParams} from "@/shared/lib/api/queryParams"
import {ChallengeStatus} from "@/shared/api/enums"

import { ChallengesApi } from './types'

export const challengesApi: ChallengesApi = {
    fetchActive: async ({ page }) =>
        createRequest({
            url: `challenges/${queryParams({
                page,
                status: [
                    ChallengeStatus.NOT_STARTED, 
                    ChallengeStatus.IN_PROGRESS, 
                    ChallengeStatus.NOT_CLAIMED
                ].join(','),
                page_size: 15,
            })}`,
            method: 'GET',
        }),
    fetchCompleted: async ({ page }) =>
        createRequest({
            url: `challenges/${queryParams({
                page,
                status: ChallengeStatus.CLAIMED,
                page_size: 15,
            })}`,
            method: 'GET',
        }),
    fetchInfo: async ({ id }) =>
        createRequest({
            url: `challenges/completions/${id}/`,
            method: 'GET'
        }),
    start: async ({ id }) =>
        createRequest({
            url: `challenges/${id}/`,
            method: 'POST'
        }),
    claim: async ({ id }) =>
        createRequest({
            url: `challenges/${id}/`,
            method: 'POST',
        })
}