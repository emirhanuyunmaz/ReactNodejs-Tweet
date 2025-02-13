import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.BASE_URL

export const messageApiSlice = createApi({
    reducerPath:"messageApi",
    tagTypes:["message","user"],
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseUrl,
        prepareHeaders:async (headers) => {
            const access_token = await AsyncStorage.getItem("access_token")
            headers.append("token",access_token)
            return headers
        }
        },),
    

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