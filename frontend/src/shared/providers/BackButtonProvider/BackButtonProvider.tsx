import React, {createContext, useContext} from "react";
import {useTelegram} from "@/shared/lib/hooks/useTelegram";
import {useNavigate} from "react-router-dom";

type Context = {
    hide: () => void
    show: (cb?: () => void) => void
}

const backButtonProviderContext = createContext<Context>({
    hide: () => {},
    show: () => {},
})

export const BackButtonProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const navigate = useNavigate()
    const { BackButton } = useTelegram()

    function hide() {
        BackButton.hide()
    }

    function goBack() {
        navigate(-1)
    }

    function show(cb?: () => void) {
        BackButton.show()
        if (cb) {
            BackButton.offClick(goBack)
            BackButton.onClick(cb)
        } else {
            BackButton.onClick(goBack)
        }
    }

    return (
        <backButtonProviderContext.Provider
            value={{
                hide,
                show,
            }}
        >
            {children}
        </backButtonProviderContext.Provider>
    )
}

export const useBackButton = () => useContext(backButtonProviderContext)