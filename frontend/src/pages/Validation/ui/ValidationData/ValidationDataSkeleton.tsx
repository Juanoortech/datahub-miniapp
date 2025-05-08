import {clsx} from "clsx"

import styles from './ValidationData.module.scss'

export const ValidationDataSkeleton = () => (
    <div
        className={clsx(styles.root, styles.skeleton)}
    />
)