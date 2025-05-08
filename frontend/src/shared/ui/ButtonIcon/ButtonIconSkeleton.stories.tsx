import { SkeletonWrapper } from '../SkeletonWrapper'
import { ButtonIconSkeleton, ButtonIconSkeletonProps } from './ButtonIconSkeleton'
import { sizes, radius } from './model'

const meta = {
    title: 'Shared/ButtonIcon/Skeleton',
    component: ButtonIconSkeleton,
    argTypes: {
        size: {
            options: sizes,
            control: {
                type: 'select',
            },
        },
        radius: {
            options: radius,
            control: {
                type: 'select',
            },
        },
    }
}

export default meta

export const Default = {
    args: {
        size: 'm',
        radius: 'm'
    },
    render: (args: ButtonIconSkeletonProps) => (
        <SkeletonWrapper>
            <ButtonIconSkeleton 
                {...args}
            />
        </SkeletonWrapper>
    )
}