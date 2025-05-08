import {delay} from "@/shared/lib/time";

import { LeaderboardApi, GetLeaderboardResponse } from './types'

export const leaderboardApi: LeaderboardApi = {
    fetch: async ({ page }) => {
        await delay()

        function getList(): GetLeaderboardResponse['items'] {
            return Array(15).fill(page).map((page, key) => {
                const id = (page - 1) * 10 + key

                return {
                    id,
                    avatar: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                    name: `name ${id}`,
                    points: 10_000 + id,
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
    },
    fetchViewerInfo: async () => {
        await delay()

        return {
            error: false,
            payload: {
                viewer_place: 1,
                viewer_points: 100_000,
                viewer_bonus: 1.25,
            }
        }
    }
}