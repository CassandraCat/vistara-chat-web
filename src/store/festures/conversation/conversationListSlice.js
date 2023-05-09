import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = []

export const conversationListSlice = createSlice({
    name: 'conversationList',
    initialState,
    reducers: {
        syncConversationList: (state, action) => {
            state.forEach(friend => {
                action.payload = action.payload.filter(item => _.isEqual(friend, item));
            })
            return [...state, ...action.payload]
        }
    }
})

export const {syncConversationList} = conversationListSlice.actions

export default conversationListSlice.reducer