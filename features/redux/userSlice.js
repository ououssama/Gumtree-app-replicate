import { createSlice } from "@reduxjs/toolkit";
import { userLoginAction } from "./userActions";

const initialState = {
    email: 'oussama@gmail.com',
    password: '123456',
    isLogged: false
}

export const userSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        loginUser: (state, {payload}) => {
            state.email = payload.email
            state.password = payload.password
            state.isLogged = true
        }
    },

    extraReducers: builder => {
        builder.addCase(userLoginAction.pending, (state) => {
            console.log('pending: ', state);
        })
        builder.addCase(userLoginAction.fulfilled, (state, {payload}) => {
            console.log('fulfilled: ',payload);
        })
        builder.addCase(userLoginAction.rejected, (state, {payload}) => {
            cconsole.log('rejected: ',payload);
        })

    }
        // [userLoginAction.pending]: (state) => {
        //     console.log('pending: ', state);
        // },
        // [userLoginAction.fulfilled]: (state, {payload}) => {
        //     console.log('fulfilled: ',payload);
        // },
        // [userLoginAction.rejected]: (state, {payload}) => {
        //     console.log('rejected: ',payload);
        // }
    
})

export const {loginUser} = userSlice.actions
export default userSlice.reducer

