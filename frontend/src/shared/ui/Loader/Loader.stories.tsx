import { Loader } from './Loader'
import { sizes, colors } from './model'

const meta = {
    title: 'Shared/Loader',
    component: Loader,
    argTypes: {
        size: {
            options: sizes,
            control: {
                type: 'select'
            }
        },
        color: {
            options: colors,
            control: {
                type: 'select'
            }
        }
    }
}

export default meta

export const Default = {
    args: {
        size: 's',
        color: 'black'
    },
}