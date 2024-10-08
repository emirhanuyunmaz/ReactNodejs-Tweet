import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./userApi/userApiSlicer";


export const store = configureStore({
    reducer:{
        [userApiSlice.reducerPath]:userApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApiSlice.middleware)
    }
})