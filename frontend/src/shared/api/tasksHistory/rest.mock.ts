import {getRandomInt} from '@/shared/lib/number'

import {HistoryElementType, TaskState} from '../enums'

import {GetTasksHistoryResponse, TasksHistoryApi} from './types'

export const tasksHistoryApi: TasksHistoryApi = {
    fetch: async ({ state, type, page }) => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        function getRandomStatus() {
            const status = getRandomInt(0, 2)

            switch (status) {
                case 0: return TaskState.ACCEPTED
                case 1: return TaskState.DECLINED
                default: return TaskState.REVIEW
            }
        }

        function getType() {
            if (type.length === 1) {
                return type[0]
            }

            const index = getRandomInt(0, 1)
            switch (index) {
                case 0: return HistoryElementType.TASK
                case 1: return HistoryElementType.VALIDATION
                default: return HistoryElementType.VALIDATION
            }
        }

        function getId(key: number) {
            return (page - 1) * 10 + key
        }

        function getList() {
            let result = [] as GetTasksHistoryResponse['items']

            if (state.length === 0) {
                result = Array(10).fill(1).map((_, key) => ({
                    completion: {
                        id: getId(key),
                        task: {
                            id: getId(key),
                            title: 'Rusty Red Rover Expedition',
                            photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            reward: getRandomInt(0, 2000),
                        },
                        completion_date_and_time: '2024-11-21T09:42:37.996Z',
                        status: getRandomStatus(),
                    },
                    task_type: getType(),
                }))
            } else {
                if (state.includes(TaskState.ACCEPTED)) {
                    result = [
                        ...result,
                        ...Array(10).fill(1).map((_, key) => ({
                            completion: {
                                id: getId(key),
                                task: {
                                    id: getId(key),
                                    title: 'Rusty Red Rover Expedition',
                                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                                    reward: getRandomInt(0, 2000),
                                },
                                completion_date_and_time: '2024-11-21T09:42:37.996Z',
                                status: TaskState.ACCEPTED,
                            },
                            task_type: getType(),
                        }))
                    ]
                }
                if (state.includes(TaskState.REVIEW)) {
                    result = [
                        ...result,
                        ...Array(10).fill(1).map((_, key) => ({
                            completion: {
                                id: getId(key),
                                task: {
                                    id: getId(key),
                                    title: 'Rusty Red Rover Expedition',
                                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                                    reward: getRandomInt(0, 2000),
                                },
                                completion_date_and_time: '2024-11-21T09:42:37.996Z',
                                status: TaskState.REVIEW,
                            },
                            task_type: getType(),
                        }))
                    ]
                }
                if (state.includes(TaskState.DECLINED)) {
                    result = [
                        ...result,
                        ...Array(10).fill(1).map((_, key) => ({
                            completion: {
                                id: getId(key),
                                task: {
                                    id: getId(key),
                                    title: 'Rusty Red Rover Expedition',
                                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                                    reward: getRandomInt(0, 2000),
                                },
                                completion_date_and_time: '2024-11-21T09:42:37.996Z',
                                status: TaskState.DECLINED,
                            },
                            task_type: getType(),
                        }))
                    ]
                }
            }

            return result
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page: page,
                last_page: 3,
                total: 30,
            },
        }
    },
}