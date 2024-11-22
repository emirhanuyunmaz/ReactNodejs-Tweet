import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./userApi/userApiSlicer";
import { contactApiSlice } from "./contactApi/contactApiSlicer";


export const store = configureStore({
    reducer:{
        [userApiSlice.reducerPath]:userApiSlice.reducer,
        [contactApiSlice.reducerPath]:contactApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApiSlice.middleware).concat(contactApiSlice.middleware)
    }
})