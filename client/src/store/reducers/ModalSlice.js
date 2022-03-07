import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    params: {
        title: "",
        displayModalSaveCancelButtons: "none",
        displayModalFeedback:"none",
        displayCreateForm: false,
        displayEditForm: false,
        displayViewForm: false,
        displayHeader: "",
        backdrop: "static"
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
            state.params.displayHeader = action.payload.displayHeader
            state.params.backdrop = action.payload.backdrop
            state.params.displayModalFeedback = action.payload.displayModalFeedback
        },

    },
})

// Action creators are generated for each case reducer function
export const { setModalParams } = modalSlice.actions

export default modalSlice.reducer