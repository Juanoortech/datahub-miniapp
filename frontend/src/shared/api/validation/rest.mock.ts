import { ValidationApi, FetchValidationsListResponse } from './types'
import {delay} from "@/shared/lib/time";
import {TaskType} from "@/shared/api/enums";
import {getRandomInt} from "@/shared/lib/number";

const types = [TaskType.AUDIO, TaskType.VIDEO, TaskType.IMAGE] as const

export const validationApi: ValidationApi = {
    fetch: async ({ page, type }) => {
        await delay()

        function getType(id: number) {
            if (!type.length) {
                return types[id % 3]
            }

            return type[getRandomInt(0, type.length - 1)]
        }

        function getTitle(type: TaskType) {
            switch (type) {
                case TaskType.IMAGE: return 'Image task'
                case TaskType.VIDEO: return 'Video task'
                case TaskType.AUDIO: return 'Audio task'
            }
        }

        function getList(): FetchValidationsListResponse['items'] {
            return Array(10).fill(1).map((_, key) => {
                const id = key + (page - 1) * 10

                const type = getType(id)

                return {
                    task: {
                        id,
                        title: getTitle(type),
                        internal_type: type,
                        photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                        reward: 25,
                        description: '',
                        text: 'do something',
                        audio_text: '',
                        example: '',
                    },
                    available: 10,
                }
            })
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page,
                last_page: 3,
                total: 3,
            }
        }
    },
    fetchExpand: async ({ id }) => {
        await delay()

        const type = types[id % 3]

        function getData() {
            switch (type) {
                case TaskType.IMAGE:
                    return 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg'
                case TaskType.AUDIO:
                    return `https://test-audio-oort.s3.eu-central-1.amazonaws.com/0788.mp3?[${new Date().getTime()}]`
                case TaskType.VIDEO:
                    return 'https://www.w3schools.com/html/mov_bbb.mp4'
            }
        }

        return {
            error: false,
            payload: {
                id,
                task: {
                    id,
                    title: 'title',
                    internal_type: type,
                    photo: '',
                    reward: 1_000,
                    description: '',
                    text: 'do something',
                    audio_text: '',
                    example: '',
                },
                file: {
                    url: getData(),
                }
            }
        }
    },
    sendResult: async () => {
        await delay()

        return {
            error: false,
            payload: null,
        }
    }
}