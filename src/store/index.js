import {configureStore} from "@reduxjs/toolkit";
import {userApiSlice} from "./festures/api/userApiSlice";
import userSessionReducer from "./festures/user/userSessionSlice"
import userInfoReducer from "./festures/user/userInfoSlice"

const store = configureStore({
    reducer: {
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        userSession: userSessionReducer,
        userInfo: userInfoReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(userApiSlice.middleware),
})

export default store