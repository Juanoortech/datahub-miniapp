import { SkeletonWrapper } from '@/shared/ui/SkeletonWrapper'
import { ActiveTaskCardSkeleton } from './ActiveTaskCardSkeleton'

const meta = {
    title: 'Entities/tasks/ActiveTaskCard/Skeleton',
    component: ActiveTaskCardSkeleton,
    argTypes: {}
}

export default meta

export const Default = {
    args: {},
    render() {
        return (
            <SkeletonWrapper>
                <ActiveTaskCardSkeleton />
            </SkeletonWrapper>
        )
    }
}