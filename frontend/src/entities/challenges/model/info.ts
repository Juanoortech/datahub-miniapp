import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Challenge} from "./types";
import {ChallengeStatus} from "@/shared/api/enums";
import {challengesApi, GetChallengeInfoResponse} from "@/shared/api/challenges";
import { TimeStamp } from "@/shared/lib/types";

const fetch = createAsyncThunk(
    'entities/challenges/info/fetch',
    async (challenge: Challenge): Promise<Challenge> => {
        console.log(challenge)
        if (challenge.status === ChallengeStatus.NOT_STARTED) {
            return challenge
        }

        const { error, payload } = await challengesApi.fetchInfo(challenge)

        if (error) {
            return challenge
        }

        return {
            ...challenge,
            moderationTime: getModerationTime(payload),
            status: getStatus(challenge, payload),
        }
    }
)

const initialState: {
    challenge: Challenge | null,
    isPending: boolean
} = {
    challenge: null,
    isPending: true
}

const challengeInfoSlice = createSlice({
    name: 'entities/challenges/info',
    initialState,
    reducers: {
        reset: state => {
            state.isPending = true
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetch.pending, state => {
                state.isPending = true
            })
            .addCase(fetch.fulfilled, (state, { payload }) => {
                state.isPending = false
                console.log('payload', payload)
                state.challenge = payload
            })
    }
})

export const challengesInfoModel = {
    reducer: challengeInfoSlice.reducer,
    actions: challengeInfoSlice.actions,
    thunks: {
        fetch,
    }
}

function getStatus(challenge: Challenge, response: GetChallengeInfoResponse): ChallengeStatus {
    if (challenge.status !== ChallengeStatus.NOT_STARTED) {
        if (response.claimed) {
            return ChallengeStatus.CLAIMED
        }

        const now = new Date()
        const canBeClaimedDate = new Date(response.can_be_claimed_in)

        console.log(now, canBeClaimedDate)

        if (now >= canBeClaimedDate) {
            return ChallengeStatus.NOT_CLAIMED
        }

        return ChallengeStatus.IN_PROGRESS
    }

    return ChallengeStatus.NOT_STARTED
}

function getModerationTime(response: GetChallengeInfoResponse): TimeStamp {
    const now = new Date()
    const canBeClaimedDate = new Date(response.can_be_claimed_in)

    if (!now || !canBeClaimedDate) {
        return 0 as TimeStamp
    }

    console.log(now, canBeClaimedDate)

    if (now < canBeClaimedDate) {
        return canBeClaimedDate.getTime() - now.getTime() as TimeStamp
    }

    return 0 as TimeStamp
}