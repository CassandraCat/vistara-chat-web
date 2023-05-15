import {createSlice} from "@reduxjs/toolkit";

const initialState = []

export const conversationListSlice = createSlice({
    name: 'conversationList',
    initialState,
    reducers: {
        syncConversationList: (state, action) => {
            debugger
            // action.payload.forEach(item => {
            //     const existingFriend = state.find(friend => friend.toId === item.toId);
            //     if (existingFriend) {
            //         existingFriend.message = item.message;
            //     } else {
            //         state.push({...item});
            //     }
            // });

            const updatedState = action.payload.reduce((newState, item) => {
                const existingFriendIndex = newState.findIndex(friend => friend.toId === item.toId);
                if (existingFriendIndex !== -1) {
                    newState[existingFriendIndex] = {...newState[existingFriendIndex], message: item.message};
                } else {
                    newState.push(item);
                }
                return newState;
            }, [...state]);
            return updatedState;
        }
    }
})

export const {syncConversationList} = conversationListSlice.actions

export default conversationListSlice.reducer