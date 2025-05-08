import {LeaderBoardHeader, LeaderboardList} from "@/widgets/leaderboard"

import styles from './Leaderboard.module.scss'

export const Content = () => {
    return (
        <div className={styles.wrapper}>
            <LeaderBoardHeader className={styles.header} />
            <LeaderboardList />
        </div>
    )
}