import { useParams } from "react-router-dom"

import { TaskLayout } from "@/widgets/activeTasks"

import { Skeleton } from './Skeleton'
import { Content } from './Content'

export const VideoTask = () => {
    const params = useParams()

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