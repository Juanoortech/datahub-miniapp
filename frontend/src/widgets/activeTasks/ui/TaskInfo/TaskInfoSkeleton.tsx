import { TextSkeleton } from '@/shared/ui/TextSkeleton'
import { SkeletonWrapper } from '@/shared/ui/SkeletonWrapper'

import styles from './TaskInfo.module.scss'
import { ExpandTaskDetailsSkeleton } from '../ExpandTaskDetails'
import { FloatingButtons } from '@/shared/ui/FloatingButtons'
import { ButtonSkeleton } from '@/shared/ui/Button/ButtonSkeleton'

export const TaskInfoSkeleton = () => (
    <SkeletonWrapper>
        <TextSkeleton 
            view={'base'}
            fontSize={24}
            lineHeight={32}
            widthRange={[0.5, 0.9]}
        />
        <div 
            className={styles['main-image']}
        />
        <div
            className={styles.description}
        >
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
        </div>
        <h2 className={styles['details-title']}>Task Details</h2>
        <div className={styles.details}>
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
            <TextSkeleton 
                view={'secondary'}
                fontSize={14}
                lineHeight={20}
                widthRange={[0.6, 0.9]}
            />
        </div>
        <ExpandTaskDetailsSkeleton 
            className={styles['details-card']}
        />
        <FloatingButtons>
            <ButtonSkeleton />
        </FloatingButtons>
    </SkeletonWrapper>
)