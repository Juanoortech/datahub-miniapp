import { TaskDifficult, TaskType } from "@/shared/api/enums";

export function getTaskTypeText(type: TaskType) {
    switch (type) {
        case TaskType.IMAGE: return 'Image Contribution'
        case TaskType.VIDEO: return 'Video Contribution'
        case TaskType.AUDIO: return 'Audio Contribution'
    }
}

export function getTaskDifficultText(type: TaskDifficult) {
    switch (type) {
        case TaskDifficult.DIFFICULT: return 'Difficult'
        case TaskDifficult.EASY: return 'Easy'
    }
}