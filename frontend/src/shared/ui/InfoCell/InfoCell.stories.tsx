import { names } from '../Icon/model'

import { views } from './model'
import { InfoCell } from './InfoCell'

const meta = {
    title: 'Shared/InfoCell',
    component: InfoCell,
    argTypes: {
        icon: {
            options: names,
            control: {
                type: 'select'
            }
        },
        view: {
            options: views,
            control: {
                type: 'select'
            }
        }
    }
}

export default meta

export const Default = {
    args: {
        icon: 'clock',
        title: 'title',
        view: 'brand',
    }
}