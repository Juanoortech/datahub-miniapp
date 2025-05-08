import { fn } from '@storybook/test'
import { names } from '../Icon/model'
import { ButtonIcon } from './ButtonIcon'
import { tags, sizes, radius, views } from './model'

const meta = {
    title: 'Shared/ButtonIcon/ButtonIcon',
    component: ButtonIcon,
    argTypes: {
        tag: {
            options: tags,
            control: {
                type: 'select'
            },
        },
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
        icon: {
            options: names,
            control: {
                type: 'select',
            },
        },
        view: {
            options: views,
            control: {
                type: 'select',
            },
        },
        to: 'text',
        onClick: 'function'
    }
}

export default meta

export const Default = {
    args: {
        tag: 'button',
        size: 'm',
        radius: 'rounded',
        view: 'surface',
        to: '',
        icon: 'copy-outline',
        onClick: fn,
    }
}