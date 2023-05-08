import {createSlice} from "@reduxjs/toolkit";

const initialState = {}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        modifyUserInfo: (state, action) => {
            Object.assign(state, action.payload)
        }
    }
})

export const {modifyUserInfo} = userInfoSlice.actions

export default userInfoSlice.reducer