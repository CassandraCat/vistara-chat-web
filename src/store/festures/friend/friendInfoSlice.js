import {createSlice} from "@reduxjs/toolkit";

const initialState = {}

export const friendInfoSlice = createSlice({
    name: "friendInfo",
    initialState,
    reducers: {
        modifyFriendInfo: (state, action) => {
            return {...action.payload}
        }
    }
})

export const {modifyFriendInfo} = friendInfoSlice.actions

export default friendInfoSlice.reducer