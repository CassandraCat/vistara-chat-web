import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {userApiSlice} from "./festures/api/userApiSlice";
import userSessionReducer from "./festures/user/userSessionSlice"
import userInfoReducer from "./festures/user/userInfoSlice"
import friendListReducer from './festures/Friend/friendListSlice'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    // 指定哪些reducer数据持久化
    whitelist: ['userSession', 'userInfo', 'friendList'],
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        userSession: userSessionReducer,
        userInfo: userInfoReducer,
        friendList: friendListReducer
    }),
)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(userApiSlice.middleware),
})

const persistor = persistStore(store)

export {
    store,
    persistor
}

