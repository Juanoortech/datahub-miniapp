import React, {createContext, useContext} from "react";

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
    function hide() {}
    function show(cb?: () => void) {
        // No-op for custom callback or default back
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

export const useBackButton = () => useContext(backButtonProviderContext);