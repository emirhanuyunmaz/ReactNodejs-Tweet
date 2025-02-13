import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./userApi/userApiSlicer";
import { contactApiSlice } from "./contactApi/contactApiSlicer";
import { messageApiSlice } from "./messageApi/messageApiSlicer";


export const store = configureStore({
    reducer:{
        [userApiSlice.reducerPath]:userApiSlice.reducer,
        [contactApiSlice.reducerPath]:contactApiSlice.reducer,
        [messageApiSlice.reducerPath]:messageApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApiSlice.middleware).concat(contactApiSlice.middleware).concat(messageApiSlice.middleware)
    }
})