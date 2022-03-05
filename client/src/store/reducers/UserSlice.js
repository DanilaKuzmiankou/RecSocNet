import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: {}, //current user - is the user who is currently performing actions in the application, auth0 user
        browsedUser: {},
        isCurrentUserAdmin: false,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        setBrowsedUser: (state, action) => {
            state.browsedUser = action.payload
        },
        setIsCurrentUserAdmin: (state, action) => {
            state.isCurrentUserAdmin = action.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser, setBrowsedUser, setIsCurrentUserAdmin } = userSlice.actions

export default userSlice.reducer