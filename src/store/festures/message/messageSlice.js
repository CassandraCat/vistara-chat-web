import {createSlice} from "@reduxjs/toolkit";

const initialState = []

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        modifyMessageList: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const {modifyMessageList} = messageSlice.actions

export default messageSlice.reducer