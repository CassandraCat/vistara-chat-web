import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = []

export const blackFriendListSlice = createSlice({
    name: "blackFriendList",
    initialState,
    reducers: {
        syncBlackFriendList: (state, action) => {
            debugger
            state.forEach(blackFriend => {
                action.payload = action.payload.filter(item => blackFriend.userId !== item.userId)
            })
            return [...state, ...action.payload];
        },
        removeBlackFriend: (state, action) => {
            return state.filter(friend => friend.userId !== action.payload.userId)
        }
    }
})

export const {syncBlackFriendList, removeBlackFriend} = blackFriendListSlice.actions

export default blackFriendListSlice.reducer