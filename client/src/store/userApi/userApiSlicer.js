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
                    return `user/getTweetComment/${id}`
                },
                providesTags:["Tweet"]
            })


        }
    }
})

export const {useGetDemoQuery,useUserLoginMutation,useGetTweetListQuery,useAddTweetMutation,useGetUserProfileQuery,useTweetLikeMutation,useGetUserTweetLikeListQuery,useUserTweetDislikeMutation,useGetSingleTweetQuery,useUserTweetAddCommentMutation, useTweetCommentListQuery } = userApiSlice