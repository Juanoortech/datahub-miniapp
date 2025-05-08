import { TaskState } from '@/shared/api/enums'
import { HistoryTaskCard } from './HistoryTaskCard'

const meta = {
    title: 'Entities/history/HistoryTaskCard/HistoryTaskCard',
    component: HistoryTaskCard,
    argTypes: {
        id: 'number',
        award: 'number',
        date: 'number',
        title: 'text',
        state: {
            options: [
                TaskState.ACCEPTED,
                TaskState.REVIEW,
                TaskState.DECLINED
            ],
            control: {
                type: 'select'
            }
        },
        img: 'text'
    }
}

export default meta

export const Default = {
    args: {
        id: 1,
        award: 50,
        date: new Date().getTime(),
        title: 'Rusty Red Rover Expedition',
        state: TaskState.ACCEPTED,
        img: 'https://randomwordgenerator.com/img/picture-generator/54e0d6444e53a414f1dc8460962e33791c3ad6e04e5074417c2d78d39444c4_640.jpg',
    }
}