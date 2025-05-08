import { FlatList } from './FlatList'
import React from "react"

const meta = {
    title: 'Shared/FlatList',
    component: FlatList,
    argTypes: {
        list: 'array',
        itemHeight: 'number',
        renderItem: 'function'
    }
}

export default meta

export const Default = {
    args: {
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        itemHeight: 100,
        renderItem: (item: number, style: React.CSSProperties) => (
            <div
                key={item}
                style={style}
            >
                {item}
            </div>
        )
    }
}
