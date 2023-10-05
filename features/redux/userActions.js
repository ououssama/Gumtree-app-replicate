import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from '../../firebase/firebase.js'
import { signInWithEmailAndPassword } from "firebase/auth";

export const userLoginAction = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            const signin = await signInWithEmailAndPassword(auth, data.email, data.password);
            return signin.user
            // const userCredential = signin.user
            // return userCredential
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
            
        }
           
    }
)