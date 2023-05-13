import {createSlice} from "@reduxjs/toolkit";

const initialState = {}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        modifyMessageList: (state, action) => {
            if (state[action.payload.friendId] === undefined) {
                state[action.payload.friendId] = []
            }
            state[action.payload.friendId].push(action.payload.messageInfo)
        },
        addMessageId: (state, action) => {

        }
    }
})

export const {modifyMessageList} = messageSlice.actions

export default messageSlice.reducer