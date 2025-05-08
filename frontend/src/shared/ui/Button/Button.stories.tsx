import { fn } from '@storybook/test'

import { Button } from './Button'
import { tags, views } from './model'

const meta = {
    title: 'Shared/Button/Button',
    component: Button,
    argTypes: {
        tag: {
            options: tags,
            control: {
                type: 'select'
            }
        },
        view: {
            options: views,
            control: {
                type: 'select',
            }
        },
        to: 'text',
        onClick: 'function',
        isLoading: 'boolean'
    }
}

export default meta

export const Default = {
    args: {
        tag: 'button',
        view: 'brand',
        to: '',
        onClick: () => fn(),
        children: 'BUTTOn',
        isLoading: false,
    }
}