import { SkeletonWrapper } from '../SkeletonWrapper'

import { BadgeSkeleton, BadgeSkeletonProps } from './BadgeSkeleton'
import { sizes } from './model'

const meta = {
    title: 'Shared/Badge/Skeleton',
    component: BadgeSkeleton,
    argTypes: {
        size: {
            options: sizes,
            control: {
                type: 'select'
            }
        }
    }
}

export default meta

export const Default = {
    args: {
        size: 'm',
    },
    render: (args: BadgeSkeletonProps) => (
        <SkeletonWrapper>
            <BadgeSkeleton 
                {...args}
            />
        </SkeletonWrapper>
    )
}