import {createRequest} from "@/shared/lib/api/createRequest"
import {queryParams} from "@/shared/lib/api/queryParams"

import {ActiveTasksApi, UploadTaskFileMiddleResponse} from './types'
import axios from "axios";
import {delay} from "@/shared/lib/time";
import {TaskState} from "@/shared/api/enums";

export const activeTaskApi: ActiveTasksApi = {
    fetch: async ({ type, page }) =>
        createRequest({
            url: `tasks/${queryParams({
                page,
                internal_type: type.includes('all') ? undefined : type.join(',')
            })}`,
            method: 'GET',

        }),
    createEmptyCompletion: async ({ task_id }) =>
        createRequest({
            url: `tasks/completions/`,
            method: 'POST',
            data: {
                task_id,
            }
        }),
    fetchExpand: async ({ task_id }) =>
        createRequest({
            url: `tasks/${task_id}/`,
            method: 'GET',
        }),
    fetchUncompletedTasks: async () =>
        createRequest({
            url: `tasks/completions/${queryParams({
                page: 1,
                status: TaskState.HOLD,
            })}`,
            method: 'GET',
        }),
    cancel: ({ completion_id }) =>
        createRequest({
            url: `tasks/completions/${completion_id}/`,
            method: 'DELETE'
        }),
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
    uploadTaskFile: async ({ file, completionId }) => {
        try {
            const {
                error,
                payload
            } = await createRequest<UploadTaskFileMiddleResponse>({
                url: `tasks/sign-s3/${queryParams({
                    file_type: file.type.replace('/', '\/'),
                    file_name: file.name,
                    completion_id: completionId,
                })}`,
                method: 'GET',
            })

            if (!error && payload) {
                let formData = new FormData()
                // for (let key in payload.presigned_post.fields) {
                //     formData.append(key, payload.presigned_post.fields[key as keyof typeof payload.presigned_post.fields])
                // }
                // formData.set('AWSAccessKeyId', 'AKIAQK4KPRGP2LZ4DALO')
                // formData.set('key', 'hpWjp+mIF4GGbJ+znbWdYT3RzClIdN+afcH7bwmv')
                // const data = await file.arrayBuffer()
                formData.append('file', file)



                const response = await axios.put(
                    payload.presigned_url,
                    file,
                    {
                        headers: {
                            "Content-Type": file.type.replace('/', '\/'),
                        }
                    }
                )

                if (response.status === 200 || response.status === 204) {
                    const { error } = await createRequest({
                        url: `tasks/completions/${completionId}/`,
                        method: 'PUT',
                        data: {
                            file_uuid: payload.file_uuid
                        }
                    })

                    if (!error) {
                        return {
                            error: false,
                            payload: null
                        }
                    }
                }

                return {
                    error: true,
                    payload: null
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
    },
}