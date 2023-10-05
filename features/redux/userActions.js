import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from '../../firebase/firebase.js'
import { signInWithEmailAndPassword } from "firebase/auth";

export const userLoginAction = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const signin = await signInWithEmailAndPassword(auth, data.email, data.password)
            if (signin.user.uid != null) {
                return signin.user
            }
            // const userCredential = signin.user
            // return userCredential
        } catch (err) {
            return rejectWithValue(err.code)
            // rejectWithValue(err.code)
        }
           
    }
)