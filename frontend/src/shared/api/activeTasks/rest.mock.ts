import {getRandomInt} from '@/shared/lib/number'
import { TaskType } from '../enums'
import {ActiveTasksApi, FetchActiveTasksResponse} from './types'
import {TimeStamp} from '@/shared/lib/types'
import {delay} from "@/shared/lib/time";

const IMAGE_IDS = [0, 1, 2, 3, 5]
const VIDEO_IDS = [6, 7, 8, 9, 10]
const AUDIO_IDS = [11, 12, 13, 14, 15]

export const activeTaskApi: ActiveTasksApi = {
    fetch: async ({ type, page }) => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        function getType(id: number) {
            if (IMAGE_IDS.includes(id)) {
                return TaskType.IMAGE
            } else if (VIDEO_IDS.includes(id)) {
                return TaskType.VIDEO
            }

            return TaskType.AUDIO
        }

        function getList() {
            let result = [] as FetchActiveTasksResponse['items']

            if (type.includes('all')) {
                result = Array(15).fill(1).map((_, key) => ({
                    id: key + (page - 1) * 10,
                    internal_type: getType(key),
                    title: 'Autonomous Driving',
                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                    reward: getRandomInt(1_000, 10_000),
                    description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                    text: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                    example: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                    time_to_complete: '2024-11-18T11:53:22.444Z',
                    limit_completions: 100,
                    limit_file_size: 30,
                    limit_video_length: 30,
                    limit_audio_length: 30,
                    validation_percent: 1,
                }))
            } else {
                if (type.includes(TaskType.IMAGE)) {
                    result = [
                        ...result,
                        ...Array(5).fill(1).map((_, key) => ({
                            id: IMAGE_IDS[key] + (page - 1) * 10,
                            internal_type: TaskType.IMAGE,
                            title: 'Autonomous Driving',
                            photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            reward: getRandomInt(1_000, 10_000),
                            description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            text: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            example: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            time_to_complete: '2024-11-18T11:53:22.444Z',
                            limit_completions: 100,
                            limit_file_size: 30,
                            limit_video_length: 30,
                            limit_audio_length: 30,
                            validation_percent: 1,
                        })),
                    ]
                }
                if (type.includes(TaskType.VIDEO)) {
                    result = [
                        ...result,
                        ...Array(5).fill(1).map((_, key) => ({
                            id: VIDEO_IDS[key] + (page - 1) * 10,
                            internal_type: TaskType.VIDEO,
                            title: 'Autonomous Driving',
                            photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            reward: getRandomInt(1_000, 10_000),
                            description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            text: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            example: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            time_to_complete: '2024-11-18T11:53:22.444Z',
                            limit_completions: 100,
                            limit_file_size: 30,
                            limit_video_length: 30,
                            limit_audio_length: 30,
                            validation_percent: 1,
                        })),
                    ]
                }
                if (type.includes(TaskType.AUDIO)) {
                    result = [
                        ...result,
                        ...Array(5).fill(1).map((_, key) => ({
                            id: AUDIO_IDS[key] + (page - 1) * 10,
                            internal_type: TaskType.AUDIO,
                            title: 'Autonomous Driving',
                            photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            reward: getRandomInt(1_000, 10_000),
                            description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            text: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                            example: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                            time_to_complete: '2024-11-18T11:53:22.444Z',
                            limit_completions: 100,
                            limit_file_size: 30,
                            limit_video_length: 30,
                            limit_audio_length: 30,
                            validation_percent: 1,
                        })),
                    ]
                }
            }

            return result
        }

        return {
            error: false,
            payload: {
                items: getList(),
                page,
                last_page: 3,
                total: 45
            }
        }
    },
    // @ts-ignore
    fetchExpand: async id => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        if (IMAGE_IDS.includes(Number(id))) {
            return {
                error: false,
                payload: {
                    id: Number(id),
                    title: 'Autonomous Driving',
                    internal_type: TaskType.IMAGE,
                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                    reward: getRandomInt(1_000, 10_000),
                    description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                    text: 'text',
                    audio_text: 'audio text',
                    example: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                    details: 'Please label the road signs, your effort will help make autonomous driving safer.',
                    fileSize: 'Up to 3MB',
                    time: getRandomInt(1, 5) * 60000 as TimeStamp,
                    task: 'Please take a picture that looks similar to the example above.'
                }
            }
        }

        if (VIDEO_IDS.includes(Number(id))) {
            return {
                error: false,
                payload: {
                    id: Number(id),
                    title: 'Autonomous Driving',
                    internal_type: TaskType.VIDEO,
                    photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                    reward: getRandomInt(1_000, 10_000),
                    description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                    text: 'text',
                    audio_text: 'audio text',
                    example: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    details: 'Please label the road signs, your effort will help make autonomous driving safer.',
                    fileSize: 'Up to 3MB',
                    time: getRandomInt(1, 5) * 60000 as TimeStamp,
                    duration: getRandomInt(1, 5) * 60000 as TimeStamp,
                    task: 'Please take a picture that looks similar to the example above.'
                }
            }
        }

        return {
            error: false,
            payload: {
                id: Number(id),
                title: 'Video introduction',
                internal_type: TaskType.AUDIO,
                photo: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
                reward: getRandomInt(1_000, 10_000),
                description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.`,
                text: 'text',
                audio_text: 'audio text',
                example: `https://test-audio-oort.s3.eu-central-1.amazonaws.com/0788.mp3?[${new Date().getTime()}]`,
                details: 'Please label the road signs, your effort will help make autonomous driving safer.',
                fileSize: 'Up to 3MB',
                time: getRandomInt(1, 5) * 60000 as TimeStamp,
                task: 'Please take a picture that looks similar to the example above.',
            }
        }
    },
    uploadPhotoResult: async _data => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        return {
            error: false,
            payload: {
                status: true,
                errorCode: 0,
            }
        }
    },
    uploadVideoResult: async _data => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        return {
            error: false,
            payload: {
                status: true,
                errorCode: 0,
            }
        }
    },
    uploadAudioResult: async _data => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        return {
            error: false,
            payload: {
                status: true,
                errorCode: 0,
            }
        }
    },
    createEmptyCompletion: async () => {
        await delay()

        return {
            error: false,
            payload: {
                id: 1,
                task_id: 1,
            }
        }
    },
    cancel: async () => {
        await new Promise(resolve => setTimeout(resolve, 3_000))

        return {
            error: false,
            payload: null,
        }
    },
    fetchUncompletedTasks: async () => {
        await delay()

        return {
            error: false,
            payload: {
                items: []
            }
        }
    }
}