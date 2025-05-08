import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: {
    state: number
} = {
    state: 0
}

const mainPageSlice = createSlice({
    name: 'MainPageSlice',
    initialState,
    reducers: {
        setState: (state, { payload }: PayloadAction<number>) => {
            state.state = payload
        }
    }
})

export const mainModel = {
    reducer: mainPageSlice.reducer,
    actions: mainPageSlice.actions,
    thunks: {},
}