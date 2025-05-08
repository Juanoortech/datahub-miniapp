import { SkeletonWrapper } from '../SkeletonWrapper'
import { TextSkeleton, TextSkeletonProps } from './TextSkeleton'
import { views } from './model'

const meta = {
    title: 'Shared/TextSkeleton',
    component: TextSkeleton,
    argTypes: {
        fontSize: 'number',
        lineHeight: 'number',
        view: {
            options: views,
            control: {
                type: 'select'
            }
        },
        widthRange: 'array',
    }
}

export default meta

export const Default = {
    args: {
        fontSize: 18,
        lineHeight: 24,
        view: 'base',
        widthRange: [0.2, 0.5],
    },
    render: (args: TextSkeletonProps) => (
        <SkeletonWrapper>
            <TextSkeleton 
                {...args}
            />
        </SkeletonWrapper>
    )
}