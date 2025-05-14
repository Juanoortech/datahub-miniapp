import { useState } from 'react'
import {useToaster} from "@/shared/providers";

type CopiedValue = string | null

type CopyFn = (text: string) => boolean

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
    const [copiedText] = useState<CopiedValue>(null)
    const { toast } = useToaster()

    // const copy: CopyFn = useCallback(async text => {
    //     if (!navigator?.clipboard) {
    //         console.warn('Clipboard not supported')
    //         return false
    //     }
    //
    //     try {
    //         await navigator.clipboard.writeText(text)
    //         setCopiedText(text)
    //         toast({
    //             type: 'success',
    //             text: 'Link copied successfully'
    //         })
    //         return true
    //     } catch (error) {
    //         console.warn('Copy failed', error)
    //         setCopiedText(null)
    //         toast({
    //             type: 'error',
    //             text: 'Link copied unsuccessfully. Please, try again'
    //         })
    //         return false
    //     }
    // }, [])
    function copy(text: string): boolean {
        try {

            const textarea = document.createElement('textarea')
            document.body.style.setProperty('pointer-events', 'all')

            textarea.value = text;

            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            textarea.style.left = '-9999px';

            document.body.appendChild(textarea);

            textarea.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                toast({
                    type: 'error',
                    text: 'Link copied unsuccessfully. Please, try again'
                })
                return false
            }

            document.body.removeChild(textarea);
            // if (prevState !== 'all') {
            //     document.body.style.setProperty('pointer-events', prevState)
            // }

            toast({
                type: 'success',
                text: 'Link copied successfully'
            })
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    return [copiedText, copy]
}