import { TaskDifficult, TaskType } from '@/shared/api/enums'
import { ActiveTaskCard } from './ActiveTaskCard'

const meta = {
    title: 'Entities/tasks/ActiveTaskCard/ActiveTaskCard',
    component: ActiveTaskCard,
    argTypes: {
        id: 'number',
        type: {
            options: [
                TaskType.AUDIO,
                TaskType.IMAGE,
                TaskType.VIDEO
            ],
            control: {
                type: 'select'
            }
        },
        img: 'text',
        title: 'text',
        description: 'text',
        difficult: {
            options: [
                TaskDifficult.DIFFICULT,
                TaskDifficult.EASY,
            ],
            control: {
                type: 'select'
            }
        },
        price: 'number',
        duration: 'number',
        onClick: 'function'
    }
}

export default meta

export const Default = {
    args: {
        id: 1,
        type: TaskType.IMAGE,
        img: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
        title: 'Dataset For Automation Driving',
        description: `Your smartphone's power helps move AI progress forward. With OORT DataHub, your device aids in processing datasets that revolutionize our world and make it a better and safer place with AI technology. Together, we're moving humanity forward.'`,
        difficult: TaskDifficult.DIFFICULT,
        price: 10_000,
        duration: 60_000,
    }
}