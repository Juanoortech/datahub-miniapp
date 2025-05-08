import React, { useRef } from "react"
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

import {Modal} from "@/shared/ui/Modal"
import {useGlobalTrigger} from "@/shared/providers";

export const CaptchaModal: React.FC<{
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onSuccess: () => void
}> = ({
    isOpen,
    setIsOpen,
    onSuccess
}) => {
    const { trigger } = useGlobalTrigger()

    const captchaRef = useRef<TurnstileInstance | null>(null)

    function onError(code: string | number) {
        if (`${code}`.slice(0, 3)) {
            trigger()
        }
    }

    return (
        <Modal
            title={'CAPTCHA'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <Turnstile
                ref={captchaRef}
                siteKey={'0x4AAAAAAA1QeGlV8f0qNVrj'}
                options={{
                    theme: 'light',
                    size: 'flexible'
                }}
                onError={onError}
                onSuccess={onSuccess}
            />
        </Modal>
    )
}