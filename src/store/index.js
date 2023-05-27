import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {userApiSlice} from "./festures/api/userApiSlice";
import userSessionReducer from "./festures/user/userSessionSlice"
import userInfoReducer from "./festures/user/userInfoSlice"
import friendListReducer from './festures/friend/friendListSlice'
import conversationListReducer from './festures/conversation/conversationListSlice'
import friendInfoReducer from './festures/friend/friendInfoSlice'
import messageContentReducer from './festures/message/messageContentSlice'
import messageListReducer from './festures/message/messageSlice'
import blackFriendListReducer from './festures/friend/blackFriendListSlice'
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
    whitelist: ['userSession', 'userInfo', 'friendList', 'conversationList', 'friendInfo', 'messageList','blackFriendList'],
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        [userApiSlice.reducerPath]: userApiSlice.reducer,
        userSession: userSessionReducer,
        userInfo: userInfoReducer,
        friendList: friendListReducer,
        conversationList: conversationListReducer,
        friendInfo: friendInfoReducer,
        messageContent: messageContentReducer,
        messageList: messageListReducer,
        blackFriendList: blackFriendListReducer
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

