import React from "react"
import {useSelector} from "react-redux"
import {clsx} from "clsx";

import {RootState} from "@/app/store"

import {PropsDefault} from "@/shared/lib/types"
import {Icon} from "@/shared/ui";
import {LazyImage} from "@/shared/ui/LazyImage/LazyImage";

import styles from './ReferralSystemList.module.scss'
import {TransitionFade} from "@/shared/ui/TransitionFade";
import {Loader} from "@/shared/ui/Loader";
import {images} from "@/shared/assets/images";

export const ReferralSystemList: React.FC<PropsDefault> = ({
    className
}) => {
    const {
        list,
        isPaginating
    } = useSelector((state: RootState) => state.referrals)

    if (!list.length) {
        return (
            <div className={styles.empty}>
                <LazyImage
                    className={styles['empty-image']}
                    src={images.Empty.NLO}
                    alt={'empty'}
                    skeletonMinHeight={160}
                />
                <p
                    className={styles['empty-description']}
                >
                    Invite your friends to earn Points
                </p>
            </div>
        )
    }

    return (
        <div className={clsx(className, styles.root)}>
            {list.map(item => (
                <div
                    key={item.id}
                    className={styles.item}
                >
                    <div className={styles.row}>
                        <LazyImage
                            className={styles.avatar}
                            src={item.avatar ? item.avatar : images.Empty.Avatar}
                            alt={'avatar'}
                            skeletonMinHeight={48}
                        />
                        <p className={styles.name}>{item.name}</p>
                    </div>
                    <div className={styles.row}>
                        <Icon
                            name={'coin'}
                            size={20}
                            view={'brand'}
                        />
                        <p className={styles.balance}>{item.earnings} Pts</p>
                    </div>
                </div>
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