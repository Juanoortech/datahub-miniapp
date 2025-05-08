export enum TaskDifficult {
    EASY,
    DIFFICULT,
}

export enum TaskType {
    IMAGE = 'Photo',
    VIDEO = 'Video',
    AUDIO = 'Audio'
}

export enum TaskState {
    ACCEPTED = 'Accepted',
    REVIEW = 'In Review',
    DECLINED = 'Declined',
    HOLD = 'Hold',
}

export enum TransactionType {
    WITHDRAW = 'Withdraw',
    EARNINGS = 'Deposit'
}

export enum WithdrawStatus {
    CONFIRMED = 'Successful',
    PENDING = 'Work In Progress',
    REJECTED = 'Declined',
}

export enum EarningsType {
    TASK = 'Task',
    REFERRAL = 'Referral',
    CHALLENGE = 'Challenge',
    VALIDATION = 'Validation'
}

export enum ChallengeType {
    REAL = 'Real',
    IMITATION = 'Imitation',
}

export enum ChallengeStatus {
    IN_PROGRESS = 'In Progress',
    CLAIMED = 'Claimed',
    NOT_CLAIMED = 'Not Claimed',
    NOT_STARTED = 'Not Started',
}

export enum HistoryElementType {
    TASK = 'Task',
    VALIDATION = 'Validation',
}
