import {createSlice} from '@reduxjs/toolkit'

export const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        selectedReview: {},
        displayFilters: "none",
        editedReview: {}
    },
    reducers: {
        setReviews: (state, action) => {
            state.reviews = action.payload
        },
        setDisplayFilters: (state, action) => {
            state.displayFilters = action.payload
        },
        setSelectedReview: (state, action) => {
            state.selectedReview = action.payload
        },
        setEditedReview: (state, action) => {
            state.editedReview = action.payload
        },


    },
})

// Action creators are generated for each case reducer function
export const {
    setReviews,
    setDisplayFilters,
    setSelectedReview,
    setEditedReview,


} = reviewSlice.actions

export default reviewSlice.reducer