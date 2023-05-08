import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userId: '',
    userSign: '',
    imUserSign: ''
}

export const userSessionSlice = createSlice({
    name: 'userSession',
    initialState,
    reducers: {
        modifyUserSession: (state, action) => {
            Object.assign(state, action.payload)
        }
    }
})

export const {modifyUserSession} = userSessionSlice.actions

export default userSessionSlice.reducer

