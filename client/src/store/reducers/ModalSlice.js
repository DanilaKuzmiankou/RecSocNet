import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    params: {
        title: "",
        displayModalButtons: "none",
        displayCreateForm: false,
        displayEditForm: false,
        displayViewForm: false,
    },

}

export const modalSlice = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        setModalParams: (state, action) => {
            state.params.title = action.payload.title
            state.params.displayModalButtons = action.payload.displayModalButtons
            state.params.displayCreateForm = action.payload.displayCreateForm
            state.params.displayEditForm = action.payload.displayEditForm
            state.params.displayViewForm = action.payload.displayViewForm
        },

    },
})

// Action creators are generated for each case reducer function
export const { setModalParams } = modalSlice.actions

export default modalSlice.reducer