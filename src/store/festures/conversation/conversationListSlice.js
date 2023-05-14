import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = []

export const conversationListSlice = createSlice({
    name: 'conversationList',
    initialState,
    reducers: {
        syncConversationList: (state, action) => {
            action.payload = action.payload.filter(item => item.message !== undefined)
            action.payload.forEach(item => {
                if (state.length === 0) {
                    state.push(item)
                } else {
                    state.forEach(friend => {
                        if (friend.toId === item.toId) {
                            friend.message = item.message
                        } else {
                            state.push(item)
                        }
                    })
                }
            })
        }
    }
})

export const {syncConversationList} = conversationListSlice.actions

export default conversationListSlice.reducer