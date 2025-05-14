import {useEffect, useState} from "react"

import {ActiveChallengesList, CompletedChallengesList} from "@/widgets/challenges"

import {images} from "@/shared/assets/images"
import {TabsCardLayout} from "@/shared/ui/TabsCardLayout"

import styles from './Challenges.module.scss'
import {useBackButton} from "@/shared/providers";

export const Challenges = () => {
    const { hide } = useBackButton()

    const [state, setState] = useState(0)

    useEffect(() => {
        hide()
    }, [])

    return (
        <div className={styles.root}>
            <img
                className={styles.image}
                src={images.Decorations.PageBgDecoration}
                alt='page decoration'
            />
            <h1 className={styles.title}>Challenges</h1>
            <TabsCardLayout
                state={state}
                setState={setState}
                tabs={['Active', 'Completed']}
                components={[
                    <ActiveChallengesList />,
                    <CompletedChallengesList />
                ]}
            />
        </div>
    )
}