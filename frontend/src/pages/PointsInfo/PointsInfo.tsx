import {PageLayout} from "@/shared/ui/PageLayout";

import styles from './PointsInfo.module.scss'
import {CardInfoColumn} from "@/shared/ui/CardInfoColumn";
import {CopyCell} from "@/shared/ui/CopyCell";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {DownloadCard} from "@/entities/download";
import {CardReward} from "@/shared/ui/CardReward";
import {useBackButton} from "@/shared/providers";
import {useEffect} from "react";

export const PointsInfo = () => {
    const { walletConnectCode } = useSelector((state: RootState) => state.viewer.data)
    const { show } = useBackButton()

    useEffect(() => {
        show()
    }, [show]);

    return (
        <PageLayout
            isLoading={false}
            Content={(
                <div className={styles.root}>
                    <h1 className={styles.title}>How to use Points?</h1>
                    <p className={styles.description}>Earn points by completing tasks in our Telegram mini-app and
                        compete for exclusive rewards! <br /> Here’s how it works:</p>
                    <CardReward
                        className={styles['mini-app-rewards']}
                        view={'surface'}
                        title={'Mini App Rewards'}
                        list={[
                            {
                                icon: 'gold',
                                text: <p>Top 10 earn up to <span>100 USDT</span></p>
                            },
                            {
                                icon: 'bronze',
                                text: <p>Users outside the top 10 can win up to <span>2 USDT</span> from our <span>4k USDT</span> prize pool—the more points, the better!</p>
                            },
                        ]}
                    />
                    <h2 className={styles.subtitle}>In the DataHub app, there are even more ways to earn points:</h2>
                    <CardReward
                        className={styles['data-hub-rewards']}
                        view={'dark'}
                        title={'DataHub Rewards'}
                        list={[
                            {
                                icon: 'gold',
                                text: <p>Top 10 earn up to <span>1,000 USDT</span></p>
                            },
                            {
                                icon: 'silver',
                                text: <p>Top 500 earn up to <span>20 USDT</span></p>
                            },
                            {
                                icon: 'bronze',
                                text: <p>Users outside the top 500 can win up to <span>5 USDT</span> from our <span>10k USDT</span> prize pool—the more points, the better!</p>
                            },
                        ]}
                    />
                    <div className={styles['ways-wrapper']}>
                        <CardInfoColumn
                            icon={'login-filled'}
                            title={'Daily Logging In'}
                            description={'Log in daily to keep the streak and earn points.'}
                        />
                        <CardInfoColumn
                            icon={'task-square'}
                            title={'Completing tasks'}
                            description={'More tasks categorized as Easy, Moderate, or Difficult.'}
                        />
                        <CardInfoColumn
                            icon={'checked-filled'}
                            title={'Validating Tasks'}
                            description={'Review tasks completed by others'}
                        />
                        <CardInfoColumn
                            icon={'checked-filled'}
                            title={'Inviting friends'}
                            description={'Earn from your active referrals'}
                        />
                    </div>
                    <h2 className={styles.subtitle}>Mini-app Linking</h2>
                    <p className={styles.description}>Linking the mini-app to the DataHub app is fast and simple. Copy your unique mini-app code, paste it during registration on DataHub, and your accounts will sync instantly. As soon as the DataHub mini-app is connected with the DataHub app, your points will automatically transfer at the end of the month to the DataHub app to ensure you don’t miss out on any giveaways.</p>
                    <CopyCell
                        className={styles['wallet-code-cell']}
                        view={'surface'}
                        label={'DataHub Mini-app Binding Code'}
                        value={walletConnectCode}
                    />
                    <DownloadCard />
                </div>
            )}
            Skeleton={<></>}
        />
    )
}

