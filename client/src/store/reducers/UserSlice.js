import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: {}, //current user - is the user who is currently performing actions in the application, auth0 user
        browsedUser: {},
        isCurrentUserAdmin: false,
        isCurrentUserOwner: false,
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
        setIsCurrentUserOwner: (state, action) => {
            state.isCurrentUserOwner = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser, setBrowsedUser, setIsCurrentUserAdmin, setIsCurrentUserOwner } = userSlice.actions

export default userSlice.reducer