import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {viewerApi} from "@/shared/api/viewer";

import { Viewer } from './types'
import {GetViewerResponse} from "@/shared/api/viewer/types";

const fetch = createAsyncThunk(
    'entities/viewer/fetch',
    viewerApi.getViewer
)

const completeOnBoarding = createAsyncThunk(
    'entities/viewwe/completeOnBoarding',
    viewerApi.completeOnBoarding,
)

const initialState: {
    data: Viewer,
    isPending: boolean
} = {
    data: {
        walletAddress: '',
        photo: '',
        name: '',
        isBanned: false,
        balance: 0,
        referralsBalance: 0,
        referralCode: '',
        referralLevel: 0,
        leaderboardBonus: 0,
        story: '',
        isWalletConnect: false,
        walletConnectCode: '',
        isFirstUse: false,
    },
    isPending: true,
}

const viewerSlice = createSlice({
    name: 'entities/viewer',
    initialState,
    reducers: {
        completeOnBoarding: state => {
            state.data.isFirstUse = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetch.pending, state => {
                state.isPending = true
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                if (!payload.error) {
                    state.isPending = false
                    state.data = toDomain(payload.payload)
                }
            })
    }
})

export const viewerModel = {
    reducer: viewerSlice.reducer,
    actions: viewerSlice.actions,
    thunks: {
        fetch,
        completeOnBoarding,
    }
}

function toDomain(data: GetViewerResponse): Viewer {
    return {
        walletAddress: data.wallet_address,
        photo: data.photo,
        name: data.name,
        isBanned: data.banned,
        balance: data.balance,
        referralsBalance: data.referral_earnings,
        referralCode: data.referral_code,
        referralLevel: data.referral_level,
        leaderboardBonus: data.leaderboard_bonus,
        story: 'https://acniowa.com/wp-content/uploads/2016/03/test-image.png',
        isWalletConnect: data.wallet_was_connected,
        walletConnectCode: data.wallet_connect_code,
        isFirstUse: data.first_login,
    }
}

export function isEmptyViewer(data: Viewer) {
    return !data.walletAddress
}