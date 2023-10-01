import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: 'oussama@gmail.com',
    password: '123456'
}

export const userSlice = createSlice({
    name: 'userData',
    initialState: initialState,
    reducers: {
        loginUser: (state, {payload}) => {
            state.email = payload.email
            state.password = payload.password
        }
    }
})

export const {loginUser} = userSlice.actions
export default userSlice.reducer

