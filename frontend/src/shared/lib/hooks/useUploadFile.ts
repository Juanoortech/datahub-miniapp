export const useUploadFile = () => {
    function onUploadClick(
        accept: string,
        onSuccess: (e: {
            target: {
                files: FileList | null
            }
        }) => void
    ) {
        const input = document.createElement('input')
        input.style.display = 'none'
        input.accept = accept
        input.type = 'file'
        //@ts-ignore
        input.addEventListener('change', onSuccess)
        document.body.appendChild(input)
        input.click()
    }

    return {
        onUploadClick
    }
}