import {Link, useLocation} from "react-router-dom"
import {clsx} from "clsx"

import {RouterPathes} from "@/shared/lib/types"
import {Icon, IconProps} from "@/shared/ui"
import {useTabBarContext} from "@/shared/lib/providers"

import styles from './TabBar.module.scss'

const data: {
    icon: IconProps['name']
    text: string
    to: RouterPathes
    isActive: (v: RouterPathes) => boolean
}[] = [
    {
        icon: 'home',
        text: 'Main',
        to: RouterPathes.MAIN,
        isActive: v => {
            if ([
                RouterPathes.MAIN,
                RouterPathes.POINTS,
                RouterPathes.TRANSACTIONS,
            ].includes(v)) {
                return true
            }

            return (
                v.includes(RouterPathes.PHOTO_TASK.replace(':id', '')) ||
                v.includes(RouterPathes.VIDEO_TASK.replace(':id', '')) ||
                v.includes(RouterPathes.AUDIO_TASK.replace(':id', '')) ||
                v.includes(RouterPathes.VALIDATION.replace(':id', ''))
            )
        }
    },
    {
        icon: 'referrals',
        text: 'Referrals',
        to: RouterPathes.REFERRALS,
        isActive: v => [
            RouterPathes.REFERRALS,
            RouterPathes.TOTAL_REFERRALS,
        ].includes(v)
    },
    {
        icon: 'challenges',
        text: 'Challenges',
        to: RouterPathes.CHALLENGES,
        isActive: v => [
            RouterPathes.CHALLENGES
        ].includes(v)
    },
    {
        icon: 'leaderboard',
        text: 'Leaderboard',
        to: RouterPathes.LEADERBOARD,
        isActive: v => [
            RouterPathes.LEADERBOARD
        ].includes(v)
    },
]

export const TabBar = () => {
    const location = useLocation()
    const { isShow } = useTabBarContext()

    return (
        <div
            key={'TabBar'}
            className={clsx(
                styles.root,
                styles.wrapper,
                {
                    [styles['is-hidden']]: !isShow,
                }
            )}
        >
            {data.map((item, key) => (
                <Link
                    key={key}
                    className={clsx(
                        styles.button,
                        {
                            [styles['is-active']]: item.isActive(
                                location.pathname as RouterPathes
                            )
                        }
                    )}
                    to={item.to}
                >
                    <Icon
                        className={styles.icon}
                        name={item.icon}
                        size={24}
                        view={
                            item.isActive(
                                location.pathname as RouterPathes
                            )
                                ? 'brand'
                                : 'dark'
                        }
                    />
                    <p>
                        {item.text}
                    </p>
                </Link>
            ))}
        </div>
    )
}