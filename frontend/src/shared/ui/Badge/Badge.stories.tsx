import { names } from '../Icon/model'
import { Badge } from './Badge'
import { views, sizes } from './model'

const meta = {
    title: 'Shared/Badge/Badge',
    component: Badge,
    argTypes: {
        view: {
            options: views,
            control: {
                type: 'select'
            }
        },
        size: {
            options: sizes,
            control: {
                type: 'select'
            }
        },
        icon: {
            options: [
                undefined,
                ...names
            ],
            control: {
                type: 'select'
            }
        },
        children: 'text',
    }
}

export default meta

export const Default = {
    args: {
        view: 'default',
        size: 'm',
        icon: undefined,
        children: 'text',
    }
}