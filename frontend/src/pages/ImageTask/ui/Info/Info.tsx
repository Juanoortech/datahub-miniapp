import { useSelector } from "react-redux"

import { RootState } from "@/app/store"

import { TaskInfo } from "@/widgets/activeTasks"

import { ExpandTask } from "@/entities/tasks/model/types"

export const Info: React.FC<{
    id: ExpandTask['id']
    onStart: () => void
}> = ({
    id,
    onStart
}) => {
    const {
        pool,
        isContinue,
    } = useSelector((state: RootState) => ({
        pool: state.expandTasks.pool,
        isContinue: state.expandTasks.isContinue,
    }))

    const taskData = pool[id]
    
    return (
        <TaskInfo
            id={id}
            title={taskData.title}
            isContinue={isContinue}
            img={taskData.img}
            description={taskData.description}
            details={taskData.details}
            taskDetails={{
                reward: taskData.reward,
                fileSize: taskData.fileSize,
                time: taskData.time,
            }}
            onStart={onStart}
        />
    )
}