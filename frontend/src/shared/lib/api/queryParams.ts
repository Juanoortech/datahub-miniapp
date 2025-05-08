export function queryParams(data: Record<string, unknown>) {
    const result: string[] = Object.keys(data).map(
        key => {
            if (data[key]) {
                return `${key}=${data[key]}`
            }

            return ''
        }
    )


    return `?${
        result.filter(item => item.length > 0).join('&')
    }`
}