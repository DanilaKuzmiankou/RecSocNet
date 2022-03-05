import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/UserSlice"
import reviewReducer from "./reducers/ReviewSlice"
import modalReducer from "./reducers/ModalSlice"


const rootReducer = combineReducers({
    user: userReducer,
    review: reviewReducer,
    modal: modalReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck:false
        }),
    })
}