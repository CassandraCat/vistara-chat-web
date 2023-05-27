import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = []

export const friendListSlice = createSlice({
    name: "friendList",
    initialState,
    reducers: {
        syncFriendList: (state, action) => {
            // const filteredPayload = action.payload.filter(item => state.some(friend => !_.isEqual(friend, item)));
            return [...state, ...action.payload];
        },
        removeFriend: (state, action) => {
            return state.filter(friend => friend.userId !== action.payload.userId)
        }
    }
})

export const {syncFriendList, removeFriend} = friendListSlice.actions

export default friendListSlice.reducer