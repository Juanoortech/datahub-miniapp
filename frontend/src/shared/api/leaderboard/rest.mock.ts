import {delay} from "@/shared/lib/time";

import { LeaderboardApi, GetLeaderboardResponse } from './types'

export const leaderboardApi: LeaderboardApi = {
    fetch: async ({ page }) => {
        await delay()

        function getList(): GetLeaderboardResponse['items'] {
            return Array(15).fill(page).map((page, key) => {
                const walletAddress = `0x${(page - 1).toString().padStart(2, '0')}${key.toString().padStart(2, '0')}0000000000000000000000000000000000000000`;
                return {
                    walletAddress,
                    avatar: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                    name: `name ${walletAddress.slice(0, 8)}`,
                    points: 10_000 + key,
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