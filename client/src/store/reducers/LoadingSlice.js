import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoading: true,
    pointerEvents: ""
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
            if(state.pointerEvents===""){
                state.pointerEvents = "none"
            }
            else {
                state.pointerEvents = ""
            }
        },

    },
})

export const { setIsLoading } = loadingSlice.actions

export default loadingSlice.reducer