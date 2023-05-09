import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = []

export const friendListSlice = createSlice({
    name: "friendList",
    initialState,
    reducers: {
        syncFriendList: (state, action) => {
            state.forEach(friend => {
                action.payload = action.payload.filter(item => _.isEqual(friend, item));
            })
            return [...state, ...action.payload]
        }
    }
})

export const {syncFriendList} = friendListSlice.actions

export default friendListSlice.reducer