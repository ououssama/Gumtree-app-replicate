import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id:null,
    title:null
}

export const listingCategorySlice = createSlice({
    name: 'categorieData',
    initialState: initialState,
    reducers: {
        SelectCategorie: (state, { payload }) => {
            state.id = payload.id
            state.title = payload.title
        }
    }
})


export const { SelectCategorie } = listingCategorySlice.actions
export default listingCategorySlice.reducer