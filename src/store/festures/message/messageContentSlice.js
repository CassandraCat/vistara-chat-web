import {createSlice} from "@reduxjs/toolkit";

const initialState = ""

export const messageContentSlice = createSlice({
    name: "sendMessage",
    initialState,
    reducers: {
        modifyMessageContent: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const {modifyMessageContent} = messageContentSlice.actions

export default messageContentSlice.reducer