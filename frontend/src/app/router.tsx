import React, {useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom"

import { Main } from "@/pages/Main/Main"
import { ImageTask } from "@/pages/ImageTask/ImageTask"
import { VideoTask } from "@/pages/VideoTask/VideoTask"
import { AudioTask } from "@/pages/AudioTask/AudioTask"
import {Referrals} from "@/pages/Referrals/Referrals"
import {ReferralsInfo} from "@/pages/ReferralsInfo/ReferralsInfo"
import {Leaderboard} from "@/pages/Leaderboard/Leaderboard"
import {Transactions} from "@/pages/Transactions/Transactions"
import {Challenges} from "@/pages/Challenges/Challenges"
import {Validation} from "@/pages/Validation/Validation"
import {PointsInfo} from "@/pages/PointsInfo/PointsInfo"
import {OnBoarding} from "@/pages/OnBoarding/OnBoarding"

import { RouterPathes } from "@/shared/lib/types"
import {useTelegram} from "@/shared/lib/hooks/useTelegram"

const RootPages = [
    RouterPathes.MAIN,
    RouterPathes.REFERRALS,
    RouterPathes.LEADERBOARD,
    RouterPathes.CHALLENGES,
    RouterPathes.ON_BOARDING
] as string[]

export const RouterView = React.memo(() => {
    const location = useLocation()

    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

    useEffect(() => {
        if (location !== displayLocation) setTransitionStage("fade-out");
    }, [location, displayLocation]);

    return (
        <div
            className={transitionStage}
            onAnimationEnd={() => {
                if (transitionStage === 'fade-out') {
                    setTransitionStage('fade-in')
                    setDisplayLocation(location)
                }
            }}
        >
            <Routes location={displayLocation}>
                <Route 
                    path={RouterPathes.MAIN} 
                    element={<Main />} 
                />
                <Route
                    path={RouterPathes.POINTS}
                    element={<PointsInfo />}
                />
                <Route
                    path={RouterPathes.REFERRALS}
                    element={<Referrals />}
                />
                <Route
                    path={RouterPathes.CHALLENGES}
                    element={<Challenges />}
                />
                <Route
                    path={RouterPathes.LEADERBOARD}
                    element={<Leaderboard />}
                />
                <Route
                    path={RouterPathes.TOTAL_REFERRALS}
                    element={<ReferralsInfo />}
                />
                <Route 
                    path={RouterPathes.PHOTO_TASK} 
                    element={<ImageTask />} 
                />
                <Route 
                    path={RouterPathes.VIDEO_TASK}
                    element={<VideoTask />}
                />
                <Route
                    path={RouterPathes.AUDIO_TASK}
                    element={<AudioTask />}
                />
                <Route
                    path={RouterPathes.TRANSACTIONS}
                    element={<Transactions />}
                />
                <Route
                    path={RouterPathes.VALIDATION}
                    element={<Validation />}
                />
                <Route 
                    path={RouterPathes.ON_BOARDING}
                    element={<OnBoarding />}
                />
            </Routes>
        </div>
    )
})