import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { balanceModel } from '@/widgets/balance'

import {
    uploadAudioResultModel,
    uploadPhotoResultModel, uploadTaskFileModel,
    uploadVideoResultModel,
    cancelTaskModel,
} from '@/features/tasks'
import {validateResultModel} from "@/features/validation"
import {claimedAwardModel, startModel} from "@/features/challenges/model"

import { tasksHistoryModel } from '@/entities/history/model'
import {activeTasksModel, expandTasksModel, startedTaskModel} from '@/entities/tasks'
import { viewerModel } from "@/entities/viewer"
import { referralsModel, totalListModel } from "@/entities/referrals"
import {leaderboardModel} from "@/entities/leaderboard"
import {activeChallengesModel, challengesInfoModel, completedChallengesModel} from "@/entities/challenges"
import {transactionModel} from "@/entities/transaction"
import {validationListModel, validationPoolModel} from "@/entities/validation"
import {downloadModel} from "@/entities/download";
import {mainModel} from "@/pages/Main/model";

export const store = configureStore({
    reducer: {
        // pages
        mainPage: mainModel.reducer,

        // balance
        balance: balanceModel.reducer,

        // features
        uploadPhotoResult: uploadPhotoResultModel.reducer,
        uploadVideoResult: uploadVideoResultModel.reducer,
        uploadAudioResult: uploadAudioResultModel.reducer,
        uploadTaskFile: uploadTaskFileModel.reducer,
        cancelTask: cancelTaskModel.reducer,
        validationResult: validateResultModel.reducer,
        startChallenge: startModel.reducer,
        claimChallengeAward: claimedAwardModel.reducer,

        // entities
        viewer: viewerModel.reducer,
        leaderboard: leaderboardModel.reducer,
        referrals: referralsModel.reducer,
        referralsTotal: totalListModel.reducer,
        activeTasks: activeTasksModel.reducer,
        startedTasks: startedTaskModel.reducer,
        historyTasks: tasksHistoryModel.reducer,
        expandTasks: expandTasksModel.reducer,
        activeChallenges: activeChallengesModel.reducer,
        completedChallenges: completedChallengesModel.reducer,
        challengesInfo: challengesInfoModel.reducer,
        transactions: transactionModel.reducer,
        validation: validationListModel.reducer,
        validationPool: validationPoolModel.reducer,
        download: downloadModel.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}