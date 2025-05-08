import {LeaderBoardHeaderSkeleton, LeaderboardListSkeleton} from "@/widgets/leaderboard"

import styles from './Leaderboard.module.scss'

export const Skeleton = () => {
    return (
        <div className={styles.wrapper}>
            <LeaderBoardHeaderSkeleton
                className={styles.header}
            />
            <LeaderboardListSkeleton />
        </div>
    )
}