import React from "react"
import {clsx} from "clsx"

import { PropsDefault } from "@/shared/lib/types"
import {useCopyToClipboard} from "@/shared/lib/hooks/useCopy"
import {ButtonIcon} from "@/shared/ui/ButtonIcon"
import {Card} from "@/shared/ui/Card";

import styles from './CopyCell.module.scss'

export type CopyCellProps = PropsDefault<{
    label: string
    value: string
    showedValue?: string
    view?: 'surface' | 'gray'
    onCopy?: (text: string) => void
}>

const CopyCellComponent: React.FC<CopyCellProps> = ({
    className,
    label,
    value,
    showedValue,
    view = 'gray',
    onCopy
}) => {
    const [_, copy] = useCopyToClipboard()

    return (
        <Card
            className={clsx(className, styles.root)}
            size={'m'}
            view={view === 'gray' ? 'gray' : 'surface-border'}
        >
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <p className={styles.label}>{label}</p>
                    <p className={styles.value}>{showedValue ?? value}</p>
                </div>
                <ButtonIcon
                    size={'l'}
                    view={'surface'}
                    icon={'copy-outline'}
                    onClick={onCopy
                        ? () => onCopy(value)
                        : () => copy(value)
                    }
                />
            </div>
        </Card>
    )
}

export const CopyCell = React.memo(CopyCellComponent)