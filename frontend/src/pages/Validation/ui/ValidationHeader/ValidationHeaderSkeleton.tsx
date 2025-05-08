import {TextSkeleton} from "@/shared/ui/TextSkeleton"

import styles from './ValidationHeader.module.scss'

export const ValidationHeaderSkeleton = () => (
    <TextSkeleton
        className={styles.root}
        fontSize={24}
        lineHeight={32}
        widthRange={[0.5, 0.7]}
    />
)