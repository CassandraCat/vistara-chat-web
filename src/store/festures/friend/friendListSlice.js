import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = []

export const friendListSlice = createSlice({
    name: "friendList",
    initialState,
    reducers: {
        syncFriendList: (state, action) => {
            debugger
            // const filteredPayload = action.payload.filter(item => state.some(friend => !_.isEqual(friend, item)));
            return [...state, ...action.payload];
        }
    }
})

export const {syncFriendList} = friendListSlice.actions

export default friendListSlice.reducer