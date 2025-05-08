import { Icon } from './Icon'
import { views, names } from './model'

const meta = {
    title: 'Shared/Icon',
    component: Icon,
    argTypes: {
        name: {
            options: names,
            control: {
                type: 'select',
            }
        },
        view: {
            options: views,
            control: {
                type: 'select',
            }
        },
        size: 'number'
    }
}

export default meta

export const Default = {
    args: {
        name: 'copy-outline',
        view: 'dark',
        size: 24,
    }
}