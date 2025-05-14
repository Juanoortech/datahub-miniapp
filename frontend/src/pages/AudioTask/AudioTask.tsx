import { useParams } from "react-router-dom"

import { TaskLayout } from "@/widgets/activeTasks"

import { Skeleton } from './Skeleton'
import { Content } from './Content'
import {useBackButton} from "@/shared/providers";
import {useEffect} from "react";

export const AudioTask = () => {
    const params = useParams()

    const { show } = useBackButton()

    useEffect(() => {
        show()
    }, [show]);

    return (
        <TaskLayout
            Content={(
                <Content
                    id={Number(params.id)}
                />
            )}
            Skeleton={(
                <Skeleton />
            )}
        />
    )
}