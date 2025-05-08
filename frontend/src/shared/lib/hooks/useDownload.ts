type FileUrl = string;

export const useDownloadFile = () => {
    const downloadFile = (fileUrl: FileUrl) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() ?? '';
        link.click();
    }

    return {
        downloadFile
    }
}