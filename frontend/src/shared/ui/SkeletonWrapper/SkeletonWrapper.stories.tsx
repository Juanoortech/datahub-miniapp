import { SkeletonWrapper } from './SkeletonWrapper'

const meta = {
    title: 'Shared/SkeletonWrapper',
    component: SkeletonWrapper,
    argTypes: {}
}

export default meta

export const Default = {
    render: () => {
        return (
            <SkeletonWrapper>
                <div
                    style={{
                        background: 'red',
                        width: '100px',
                        aspectRatio: 1,
                    }}
                />
            </SkeletonWrapper>
        )
    }
}