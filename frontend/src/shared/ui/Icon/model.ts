import { icons } from "@/shared/assets/icons"

export const names = Object.keys(icons) as (keyof typeof icons)[]

export const views = [
    'surface',
    'secondary',
    'dark',
    'brand',
    'success',
    'warning',
    'critical',
    'secondary-light'
] as const