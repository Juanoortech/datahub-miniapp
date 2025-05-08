export function filtersState<T>(
    state: T[], 
    value: T,
    maxLenght: number,
    allId?: T,
) {
    let result: T[] = state

    if (
        allId &&
        value === allId
    ) {
        if (!state.includes(value)) {
            console.log('key 1')
            result = [allId]
        }
    } else {
        if (
            state.includes(value) &&
            state.length > 1
        ) {
            console.log('key 2')
            const copy = state.filter(
                item => item !== value
            )
            result = copy
        } else if (
            allId &&
            !state.includes(value) &&
            state.length === maxLenght - 1
        ) {
            console.log('key 3')
            result = [allId]
        } else if (
            allId &&
            !state.includes(value)
        ) {
            console.log('key 4')
            const copy = state.filter(
                item => item !== allId
            )
            result = [
                ...copy,
                value
            ]
        } else if (
            !state.includes(value)
        ) {
            console.log('key 5')
            result = [
                ...state,
                value,
            ]
        }
    }

    return result
}