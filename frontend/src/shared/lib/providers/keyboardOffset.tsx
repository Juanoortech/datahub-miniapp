import React, {createContext, useCallback, useContext, useState} from "react";

type KeyboardOffsetContext = {
    isOffset: boolean
    setIsOffset: (v: boolean) => void
}

const keyboardOffsetContext = createContext<KeyboardOffsetContext>({
    isOffset: false,
    setIsOffset: () => {},
})

export const KeyboardOffsetProvider = React.memo<React.PropsWithChildren>(({
    children
}) => {
    // const { isMobileDevice } = useTelegram()

    const [isOffset, setIsOffset] = useState(false)

    const onSetIsOffset = useCallback((v: boolean) => {
        setIsOffset(v)
    }, [])

    return (
        <keyboardOffsetContext.Provider
            value={{
                isOffset,
                setIsOffset: onSetIsOffset,
            }}
        >
            {children}
        </keyboardOffsetContext.Provider>
    )
})

export const useKeyboardOffset = () => useContext(keyboardOffsetContext)