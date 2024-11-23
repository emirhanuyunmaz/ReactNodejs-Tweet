import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"

const baseUrl = import.meta.env.VITE_BASE_URL

export const userApiSlice = createApi({
    reducerPath:"userApi",
    tagTypes:["Tweet"],
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
        return {
            getDemo:builder.query({
                query(){
                    return ""
                }
            }),

            userLogin:builder.mutation({
                query:post => ({
                    url:"/login",
                    method: "POST",
                    body:post
                })
            }),

            getTweetList:builder.query({
                query(){
                    return "/user/tweetList"
                },
                // Güncelleme işlemi yapılması için eklendi
                providesTags:["Tweet"]
            }),

            addTweet:builder.mutation({
                query:(post)=> ({
                    url:"/user/addTweet",
                    method:"POST",
                    body: post   
                }),
                // Burada bir ekleme yapılınca provides tags kullanan fonk. güncelleme yapılcak.
                invalidatesTags:["Tweet"]
            }),

            getUserProfile:builder.query({
                query(){
                    return "/user/profile"
                }
            }),

            updateUserProfile:builder.mutation({
                query:(body) => ({
                    url:"/user/updateProfile",
                    method:"POST",
                    body:body
                })
            }),

            tweetLike:builder.mutation({
                query:(body) =>({
                    url:"/user/likeTweet",
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Tweet"]

            }),

            getUserTweetLikeList:builder.query({
                query:() => {
                    return "/user/likeTweetList"
                },
                providesTags:["Tweet"]
            }),

            userTweetDislike:builder.mutation({
                query:(body) => ({
                    url:"/user/dislikeTweet",
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Tweet"]
            }),

            getSingleTweet:builder.query({
                query:(id) => {
                    return `/user/singleTweet/${id}` 
                },
                providesTags:["Tweet"]
            }),

            userTweetAddComment:builder.mutation({
                query:(body) => ({
                    url:`/user/addTweetComment`,
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Tweet"]
            }),

            tweetCommentList:builder.query({
                query:(id) => {
                    return `/user/getTweetComment/${id}`
                },
                providesTags:["Tweet"]
            }),

            userTweetProfile:builder.query({
                query:(data) => {
                    return {
                        url:`/user/tweetProfile/${data.id}`,
                        headers:{text:data.text}
                    }
                },
                providesTags:["Tweet"]
            }),

            getUserShortProfile:builder.query({
                query:(id) => {
                    return `/user/shortProfile/${id}`
                }
            }),

            addRetweet:builder.mutation({
                query:(body) => ({
                    url:`/user/addRetweet`,
                    method:`POST`,
                    body:body
                }),
                invalidatesTags:["Tweet"]
            }),

            getTagList:builder.query({
                query:() => {
                    return `/user/getTagList`
                },
                providesTags:["Tweet"]
            }),

            getUserTagList:builder.query({
                query:() => {
                    return `/user/getUserTagList`
                },
                providesTags:["Tweet"]
            }),

            getSingleUserTag:builder.query({
                query:(tag) => {
                    return `/user/getSingleUserTag/${tag}`
                },
                providesTags:["Tweet"]
            }),

            addTask:builder.mutation({
                query:(body) => ({
                    url:`/user/addTask`,
                    method:`POST`,
                    body:body
                }),
                // invalidatesTags:["Tweet"]
            }),

            getTaskList:builder.query({
                query:() => {
                    return `/user/taskList`
                },
                // invalidatesTags:["Tweet"]
            }),

        }
    },
})

export const {useGetDemoQuery,useUserLoginMutation,useGetTweetListQuery,useAddTweetMutation,useGetUserProfileQuery,useTweetLikeMutation,useGetUserTweetLikeListQuery,useUserTweetDislikeMutation,useGetSingleTweetQuery,useUserTweetAddCommentMutation, useTweetCommentListQuery,useUserTweetProfileQuery,useGetUserShortProfileQuery,useAddRetweetMutation,useUpdateUserProfileMutation,useGetTagListQuery,useGetUserTagListQuery,useGetSingleUserTagQuery,useAddTaskMutation,useGetTaskListQuery} = userApiSlice