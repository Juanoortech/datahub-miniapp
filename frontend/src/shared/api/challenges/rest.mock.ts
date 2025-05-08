import {delay} from "@/shared/lib/time"

import {ChallengesApi, GetActiveChallengesResponse, GetCompletedChallengesResponse} from './types'
import {getRandomInt} from "@/shared/lib/number";
import {ChallengeStatus, ChallengeType} from "@/shared/api/enums";

export const challengesApi: ChallengesApi = {
    fetchActive: async ({ page }) => {
        await delay()

        function getStatus() {
            const id = getRandomInt(1, 4)

            switch (id) {
                case 1: return ChallengeStatus.NOT_CLAIMED
                case 2: return ChallengeStatus.IN_PROGRESS
                default: return ChallengeStatus.NOT_STARTED
            }
        }

        function getType() {
            const id = getRandomInt(1, 2)

            switch (id) {
                case 1: return ChallengeType.REAL
                default: return ChallengeType.IMITATION
            }
        }

        function getList(): GetActiveChallengesResponse['items'] {
            return Array(10).fill(page).map((page, key) => {
                const id = (page - 1) * 10 + key

                return {
                    challenge: {
                        id,
                        avatar: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                        title: `task ${id}`,
                        reward: 100 + id,
                        internal_type: getType(),
                        button_text: 'Button Text',
                        imitation_timer: '01:00:00',
                        channel: {
                            uri: '@digitaltender',
                        },
                        redirect_link: 'https://github.com/',
                    },
                    status: getStatus(),
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
    fetchCompleted: async ({ page }) => {
        await delay()

        function getType() {
            const id = getRandomInt(1, 2)

            switch (id) {
                case 1: return ChallengeType.REAL
                default: return ChallengeType.IMITATION
            }
        }

        function getList(): GetCompletedChallengesResponse['items'] {
            return Array(10).fill(page).map((page, key) => {
                const id = (page - 1) * 10 + key

                return {
                    challenge: {
                        id,
                        avatar: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                        title: `task ${id}`,
                        reward: 100 + id,
                        internal_type: getType(),
                        button_text: 'Button Text',
                        imitation_timer: '01:00:00',
                        channel: {
                            uri: '@digitaltender',
                        },
                        redirect_link: 'https://github.com/',
                    },
                    status: ChallengeStatus.CLAIMED,
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
    // @ts-ignore
    fetchInfo: async ({ id }) => {
        await delay()

        function getType() {
            const id = getRandomInt(1, 2)

            switch (id) {
                case 1: return ChallengeType.REAL
                default: return ChallengeType.IMITATION
            }
        }

        return {
            error: false,
            payload: {
                challenge: {
                    id,
                    avatar: 'https://dx35vtwkllhj9.cloudfront.net/paramountpictures/avatar-studios/images/quiz/q3.webp',
                    title: `task ${id}`,
                    reward: 100 + id,
                    internal_type: getType(),
                    button_text: 'Button Text',
                    imitation_timer: '01:00:00',
                    channel: {
                        uri: '@digitaltender',
                    },
                    redirect_link: 'https://github.com/',
                },
                claimed: false,
                can_be_claimed_in: new Date().toUTCString()
            }
        }
    },
    start: async () => {
        await delay()

        return {
            error: false,
            payload: {
                created: true,
                claim_prize: 'not claimed'
            }
        }
    },
    claim: async () => {
        await delay()

        return {
            error: false,
            payload: {
                created: true,
                claim_prize: 'claimed'
            }
        }
    }
}