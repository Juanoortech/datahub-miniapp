import React from 'react'
import styles from './Loader.module.scss'
import { colors, sizes } from './model'
import { PropsDefault } from '@/shared/lib/types'

export type LoaderProps = PropsDefault<{
    color?: (typeof colors)[number]
    size?: (typeof sizes)[number]
}>

const mapColors: Record<NonNullable<LoaderProps['color']>, string> = {
    black: '#161718',
    white: '#fff',
    brand: '#0058ff',
    critical: '#c50700'
}

const SVG_ATTRS = {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 48 48',
    width: '48',
    height: '48',
}

const FIRST_GRADIENT_ATTRS = {
    id: 'loader-gradient-1',
    x1: '48',
    y1: '2.00001',
    x2: '48',
    y2: '46',
    gradientUnits: 'userSpaceOnUse',
}

const SECOND_GRADIENT_ATTRS = {
    id: 'loader-gradient-2',
    x1: '24',
    y1: '1.42452e-06',
    x2: '24',
    y2: '48',
    gradientUnits: 'userSpaceOnUse',
}

export const Loader: React.FC<LoaderProps> = ({ color, size, className }) => {
    const currentColor = mapColors[color!]!

    return (
        <div
            className={[
                styles.root,
                styles[`size_${size}`],
                className,
            ].join(' ').trim()}>
            <svg {...SVG_ATTRS}>
                <path
                    d="M24 48C30.3652 48 36.4697 45.4714 40.9706 40.9706C45.4714 36.4697 48 30.3652 48 24C48 17.6348 45.4714 11.5303 40.9706 7.02944C36.4697 2.52856 30.3652 3.28751e-07 24 0V3.6C29.4104 3.6 34.5992 5.74928 38.425 9.57502C42.2507 13.4008 44.4 18.5896 44.4 24C44.4 29.4104 42.2507 34.5992 38.425 38.425C34.5992 42.2507 29.4104 44.4 24 44.4V48Z"
                    fill={`url(#${FIRST_GRADIENT_ATTRS.id})`}
                />
                <path
                    d="M24 0C17.6348 -2.78231e-07 11.5303 2.52856 7.02944 7.02944C2.52857 11.5303 7.58791e-07 17.6348 0 24C-7.5879e-07 30.3652 2.52857 36.4697 7.02944 40.9706C11.5303 45.4714 17.6348 48 24 48V44.4C18.5896 44.4 13.4008 42.2507 9.57502 38.425C5.74928 34.5992 3.6 29.4104 3.6 24C3.6 18.5896 5.74928 13.4008 9.57502 9.57502C13.4008 5.74928 18.5896 3.6 24 3.6V0Z"
                    fill={`url(#${SECOND_GRADIENT_ATTRS.id})`}
                />
                <defs>
                    <linearGradient {...FIRST_GRADIENT_ATTRS}>
                        <stop stopColor={currentColor} stopOpacity="0" />
                        <stop
                            offset="0.95"
                            stopColor={currentColor}
                            stopOpacity="0.5"
                        />
                    </linearGradient>
                    <linearGradient {...SECOND_GRADIENT_ATTRS}>
                        <stop stopColor={currentColor} />
                        <stop
                            offset="0.95"
                            stopColor={currentColor}
                            stopOpacity="0.5"
                        />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
