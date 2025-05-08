import { BalanceSkeleton } from './BalanceSkeleton'

const meta = {
    title: 'Shared/Balance/Skeleton',
    component: BalanceSkeleton,
    argTypes: {
        label: 'text',
    }
}

export default meta

export const Default = {
    args: {
        label: 'label',
    }
}