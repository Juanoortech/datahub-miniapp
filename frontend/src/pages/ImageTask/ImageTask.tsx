import { useParams } from "react-router-dom"

import { TaskLayout } from "@/widgets/activeTasks"

import { Content } from './Content'
import { Skeleton } from './Skeleton'

export const ImageTask = () => {
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