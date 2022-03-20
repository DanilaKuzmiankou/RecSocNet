import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/UserSlice"
import reviewReducer from "./reducers/ReviewSlice"
import modalReducer from "./reducers/ModalSlice"
import loadingReducer from "./reducers/LoadingSlice"


const rootReducer = combineReducers({
    user: userReducer,
    review: reviewReducer,
    modal: modalReducer,
    loading: loadingReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        }),
    })
}