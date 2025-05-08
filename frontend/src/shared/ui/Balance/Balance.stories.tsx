import {fn} from "@storybook/test"

import { Balance } from './Balance'

const meta = {
    title: 'Shared/Balance/Component',
    component: Balance,
    argTypes: {
        label: 'text',
        balance: 'number',
        onClick: 'function'
    }
}

export default meta

export const Default = {
    args: {
        label: 'label',
        balance: 10_000,
        onClick: fn()
    }
}