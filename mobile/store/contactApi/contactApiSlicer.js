import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.BASE_URL

export const contactApiSlice = createApi({
    reducerPath:"contactApi",
    tagTypes:["contact"],
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
            followUser:builder.mutation({
                query:(body) => ({
                    url:"/contact/follow",
                    method: "POST",
                    body:body
                }),
                invalidatesTags:["contact"]
            }),
            unfollowUser:builder.mutation({
                query:(body) => ({
                    url:"/contact/unfollow",
                    method: "POST",
                    body:body
                }),
                invalidatesTags:["contact"]
            }),
            
            isFollowUser:builder.query({
                query:(id) => {
                    return `/contact/isFollow/${id}`
                },
                providesTags:["contact"]
            }),

            searchUser:builder.mutation({
                query:(body) => ({
                    url:`/contact/searchUser`,
                    method:"POST",
                    body:body
                })
            }),

            contactList:builder.query({
                query:(id) => {
                    return `/contact/contactList/${id}`
                },
                providesTags:["contact"]
            }),

            userFollowerList:builder.query({
                query:(id) => {
                    return `/contact/userFollowerList/${id}`
                },
                providesTags:["contact"]
            }),

            userFollowedList:builder.query({
                query:(id) => {
                    return `/contact/userFollowedList/${id}`
                },
                providesTags:["contact"]
            }),

            userNotificationList:builder.query({
                query:() => {
                    return `/contact/notification`
                },
            }),

            userNotificationLength:builder.query({
                query:() => {
                    return `/contact/notificationLength`
                },
            }),

            userIsFollowRequestSent:builder.query({
                query:(id) => {
                    return `/contact/isFollowRequestSent/${id}`
                },
            }),

            notificationFollowAccept:builder.mutation({
                query:(body) => ({
                    url:"/contact/notificationFollowAccept",
                    method: "POST",
                    body:body
                }),
                // invalidatesTags:["contact"]
            }),

            notificationFollowReject:builder.mutation({
                query:(body) => ({
                    url:"/contact/notificationFollowReject",
                    method: "POST",
                    body:body
                }),
                // invalidatesTags:["contact"]
            }),

            notificationShowed:builder.mutation({
                query:() => ({
                    url:"/contact/notificationShowed",
                    method: "POST",
                    // body:body
                }),
                // invalidatesTags:["contact"]
            }),
        }
    }
})

export const {useFollowUserMutation,useUnfollowUserMutation,useIsFollowUserQuery,useSearchUserMutation,useContactListQuery,useUserFollowerListQuery,useUserFollowedListQuery,useUserNotificationListQuery,useUserNotificationLengthQuery,useUserIsFollowRequestSentQuery,useNotificationFollowAcceptMutation,useNotificationFollowRejectMutation,useNotificationShowedMutation} = contactApiSlice