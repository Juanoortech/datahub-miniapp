import React, {useEffect} from "react"
import {useSelector} from "react-redux"
import {clsx} from "clsx"

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"

import styles from './LeaderboardList.module.scss'
import {LazyImage} from "@/shared/ui/LazyImage";
import {IconImage} from "@/shared/ui/IconImage";
import {toFormattedNumber} from "@/shared/lib/number";
import {TransitionFade} from "@/shared/ui/TransitionFade";
import {Loader} from "@/shared/ui/Loader";
import {images} from "@/shared/assets/images";

export const LeaderboardList: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        list,
        isPaginating,
        viewerId,
    } = useSelector((state: RootState) => ({
        list: state.leaderboard.list,
        isPaginating: state.leaderboard.isPaginating,
        viewerId: state.viewer.data.id,
    }))

    useEffect(() => {
        console.log(viewerId)
    }, [viewerId]);

    return (
        <div className={clsx(styles.root, className)}>
            {list.map((item, key) => (
                <>
                    <div
                        key={item.id}
                        className={clsx(
                            styles.item,
                            {
                                [styles['is-viewer']]: item.id === viewerId
                            }
                        )}
                    >
                        <div className={styles.row}>
                            <p className={styles.id}>{key + 1}</p>
                            <div className={styles['avatar-wrapper']}>
                                <LazyImage
                                    className={styles.avatar}
                                    src={item.avatar ? item.avatar : images.Empty.Avatar}
                                    alt={'avatar'}
                                    skeletonMinHeight={32}
                                />
                            </div>
                            <p className={styles.name}>{item.name}</p>
                            {key < 5 && (
                                <IconImage
                                    name={'crown'}
                                    size={20}
                                />
                            )}
                            {item.id === viewerId && (
                                <div className={styles.badge}>You</div>
                            )}
                        </div>
                        <p className={styles.points}>{toFormattedNumber(item.points)}</p>
                    </div>
                    {key !== list.length - 1 && (
                        <div key={`divider-${item.id}`} className={styles.divider} />
                    )}
                </>
            ))}
            <TransitionFade className={styles.loader}>
                {isPaginating && (
                    <Loader
                        color={'brand'}
                        size={'m'}
                    />
                )}
            </TransitionFade>
        </div>
    )
}