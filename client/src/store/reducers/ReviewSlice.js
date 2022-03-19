import { createSlice } from '@reduxjs/toolkit'

export const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        selectedReview: {},
        displayFilters: "none",
        editedReview: {},
        newestReviews: []
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
        setNewestReviews1: (state, action) => {
            state.newestReviews = action.payload
        },
        setNewestReview: (state, action) => {
            let editedReviewIndex = state.newestReviews.findIndex(review => review.id === action.payload.editedReview.id)
            console.log('nice: ', editedReviewIndex)
            state.newestReviews = [
        ...state.newestReviews.slice(0, editedReviewIndex), // everything before current post
                action.payload.editedReview,
        ...state.newestReviews.slice(editedReviewIndex + 1), // everything after current post
        ]

        },

    },
})

// Action creators are generated for each case reducer function
export const {
    setReviews,
    setDisplayFilters,
    setSelectedReview,
    setEditedReview,
    setNewestReviews1,
    setNewestReview

} = reviewSlice.actions

export default reviewSlice.reducer