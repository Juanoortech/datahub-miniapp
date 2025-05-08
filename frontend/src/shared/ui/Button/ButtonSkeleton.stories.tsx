import { SkeletonWrapper } from '../SkeletonWrapper'
import { ButtonSkeleton } from './ButtonSkeleton'

const meta = {
    title: 'Shared/Button/Skeleton',
    component: ButtonSkeleton,
}

export default meta

export const Default = {
    render: () => (
        <SkeletonWrapper>
            <ButtonSkeleton />
        </SkeletonWrapper>
    )
}