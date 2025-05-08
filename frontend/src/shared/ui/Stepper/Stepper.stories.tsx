import { Stepper } from './Stepper'
import { views } from './model'

const meta = {
    title: 'Shared/Stepper',
    component: Stepper,
    argTypes: {
        view: {
            options: views,
            control: {
                type: 'select'
            }
        },
        label: 'text',
        max: 'number',
        value: 'number'
    }
}

export default meta

export const Default = {
    args: {
        view: 'success',
        label: 'label',
        max: 3,
        value: 2,
    }
}