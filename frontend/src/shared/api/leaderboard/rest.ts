import { LeaderboardApi } from './types'
import {createRequest} from "@/shared/lib/api/createRequest";
import {queryParams} from "@/shared/lib/api/queryParams";

export const leaderboardApi: LeaderboardApi = {
    fetch: async ({ page }) =>
        createRequest({
            url: `accounts/leaderboard/${queryParams({
                page,
            })}`,
            method: 'GET'
        }),
    fetchViewerInfo: async () =>
        createRequest({
            url: 'accounts/leaderboard/current/',
            method: 'GET',
        })
}