import styles from './ValidationDetails.module.scss'
import {TextSkeleton} from "@/shared/ui/TextSkeleton";

export const ValidationDetailsSkeleton = () => (
    <div className={styles.root}>
        <TextSkeleton
            fontSize={18}
            lineHeight={24}
            widthRange={[0.7, 0.9]}
        />
        <TextSkeleton
            className={styles.subtitle}
            fontSize={14}
            lineHeight={20}
            widthRange={[0.5, 0.7]}
        />
        <div className={styles.description}>
            <TextSkeleton
                fontSize={14}
                lineHeight={20}
                widthRange={[0.5, 0.7]}
            />
            <TextSkeleton
                fontSize={14}
                lineHeight={20}
                widthRange={[0.5, 0.7]}
            />
            <TextSkeleton
                fontSize={14}
                lineHeight={20}
                widthRange={[0.5, 0.7]}
            />
        </div>
    </div>
)