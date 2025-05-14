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
        viewerWalletAddress,
    } = useSelector((state: RootState) => ({
        list: state.leaderboard.list,
        isPaginating: state.leaderboard.isPaginating,
        viewerWalletAddress: state.viewer.data.walletAddress,
    }))

    useEffect(() => {
        console.log(viewerWalletAddress)
    }, [viewerWalletAddress]);

    return (
        <div className={clsx(styles.root, className)}>
            {list.map((item, key) => (
                <>
                    <div
                        key={item.walletAddress}
                        className={clsx(
                            styles.item,
                            {
                                [styles['is-viewer']]: item.walletAddress === viewerWalletAddress
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
                            {item.walletAddress === viewerWalletAddress && (
                                <div className={styles.badge}>You</div>
                            )}
                        </div>
                        <p className={styles.points}>{toFormattedNumber(item.points)}</p>
                    </div>
                    {key !== list.length - 1 && (
                        <div key={`divider-${item.walletAddress}`} className={styles.divider} />
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