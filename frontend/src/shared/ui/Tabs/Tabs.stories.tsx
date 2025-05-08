import { TaskType } from '@/shared/api/enums'

import { Tabs, TabsProps } from './Tabs'
import { useState } from 'react'

const meta = {
    title: 'Shared/Tabs',
    component: Tabs,
    argTypes: {
        value: 'number',
        isDisabled: 'boolean',
        data: 'array'    
    }
}

export default meta

export const Default = {
    args: {
        value: 'all',
        data: [
            {
                text: 'All',
                id: 'all'
            },
            {
                id: TaskType.IMAGE,
                text: 'audio',
                icon: 'image',
                iconColor: 'success'
            },
            {
                id: TaskType.AUDIO,
                text: 'audio',
                icon: 'audio',
                iconColor: 'brand',
            },
            {
                id: TaskType.VIDEO,
                text: 'video',
                icon: 'video',
                iconColor: 'critical'
            }
        ] as TabsProps['data']
    },
    render: function Render(args: TabsProps) {
        const [value, setValue] = useState<(string | number)[]>(['all'])

        return (
            <Tabs 
                value={value}
                data={args.data}
                isDisabled={args.isDisabled}
                setValue={v => {
                    if (value.includes(v)) {
                        const copy = value.filter(item => item !== v)
                        setValue(copy)
                    } else {
                        setValue([
                            ...value,
                            v,
                        ])
                    }
                }}
            />
        )
    }
}