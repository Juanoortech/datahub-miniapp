import React, {createContext, useContext} from "react"
import { Toaster, toast } from 'sonner'

import {IconImage} from "@/shared/ui/IconImage"

import styles from './ToasterProvider.module.scss'

type Context = {
    toast: (params: {
        type: 'success' | 'error',
        text: string
    }) => void
}

const toasterProviderContext = createContext<Context>({
    toast: () => {}
})

export const ToasterProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const onToast = (params: {
        type: 'success' | 'error',
        text: string
    }) => {
        toast.custom(
            t => (
                <Toast
                    type={params.type}
                    text={params.text}
                    onClick={() => toast.dismiss(t)}
                />
            ),
            {
                className: styles.root,
                duration: 2000,
            }
        )
    }

    return (
        <toasterProviderContext.Provider
            value={{ toast: onToast }}
        >
            {children}
            <Toaster
                position={'top-center'}
            />
        </toasterProviderContext.Provider>
    )
}

export const useToaster = () => useContext(toasterProviderContext)
export const useGlobalTrigger = () => {
    const { toast } = useToaster()

    function trigger() {
        toast({
            type: 'error',
            text: 'Something went wrong'
        })
    }

    return {
        trigger,
    }
}

const Toast: React.FC<{
    type: 'success' | 'error'
    text: string
    onClick: () => void
}> = ({
    type,
    text,
    onClick
}) => (
    <div className={styles.toast} onClick={onClick}>
        <IconImage
            name={type === 'success' ? 'success' : 'cancel'}
            size={32}
        />
        <p>{text}</p>
    </div>
)