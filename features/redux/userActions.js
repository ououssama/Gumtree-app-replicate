import { createAsyncThunk } from "@reduxjs/toolkit";
import { app } from "../../firebase/firebase";

export const userLoginAction = createAsyncThunk(
    "auth/login",
    async (user, { rejectWithValue }) => {
        try {
            // const authUser = app.auth().signInWithEmailAndPassword(user.email, user.password)
            // return authUser;
        } catch (error) {
            rejectWithValue(error)
        }
    }
)