import React, { createContext, useContext, useState } from "react"

type Context = {
    isShow: boolean
    show: () => void
    hide: () => void
}

const TabBarContext = createContext<Context>({
    isShow: true,
    show: () => {},
    hide: () => {}
})

export const TabBarProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const [isShow, setIsShow] = useState(true)

    return (
        <TabBarContext.Provider
            value={{
                isShow,
                show: () => setIsShow(true),
                hide: () => setIsShow(false),
            }}
        >
            {children}
        </TabBarContext.Provider>
    )
}

export const useTabBarContext = () => useContext(TabBarContext)