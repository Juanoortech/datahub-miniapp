import { IconImage } from './IconImage'
import { names } from './model'

const meta = {
    title: 'Shared/IconImage',
    component: IconImage,
    argTypes: {
        name: {
            options: names,
            control: {
                type: 'select',
            }
        },
        size: 'number'
    }
}

export default meta

export const Defauilt = {
    args: {
        name: 'play',
        size: 24,
    }
}