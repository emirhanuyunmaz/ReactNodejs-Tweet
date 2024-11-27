import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"

const baseUrl = import.meta.env.VITE_BASE_URL

export const messageApiSlice = createApi({
    reducerPath:"messageApi",
    tagTypes:["message","user"],
    baseQuery: fetchBaseQuery({
        baseUrl:baseUrl,
        prepareHeaders(header){
            const token = Cookies.get("accessToken")
            const refreshToken = Cookies.get("refreshToken")
            if(token){
                header.set("token",token)
                header.set("refreshToken",refreshToken)
            }
            return header
        },
    }),

    endpoints(builder){
        return{
            // Mesajlaşılacak kullanıcı listesi.
            getUserMessageList:builder.query({
                query:() => {
                    return `/message/messageUser`
                },
                providesTags:["user"]
            }),
            
            // Kullanıcıların mesajlaşma listesi.
            getUserAllMessage:builder.query({
                query:(id) => {
                    return `/message/messageList/${id}`
                }
            })

        }
    }


})


export const {useGetUserMessageListQuery,useGetUserAllMessageQuery} = messageApiSlice