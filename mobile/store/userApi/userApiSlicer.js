import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = process.env.BASE_URL

export const userApiSlice = createApi({
    reducerPath:"userApi",
    tagTypes:["Tweet","Task"],
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseUrl,
        prepareHeaders:async (headers) => {
            const access_token = await AsyncStorage.getItem("access_token")
            // console.log("ASDSSS:",access_token);
            
            headers.append("token",access_token)
            return headers
        }
        },),
    
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
                query(headers){
                    return {
                        url:"/user/tweetList",
                        headers:headers
                    }
                },
                // Güncelleme işlemi yapılması için eklendi
                providesTags:["Tweet"]
            }),

            getTweetPostLikeList:builder.query({
                query(data) {
                    return {
                        url:`/user/likeTweetPostList/${data.id}`,
                        headers:{text:data.text}
                    }
                },
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

            deleteTweet:builder.mutation({
                query:(post)=> ({
                    url:"/user/deleteTweet",
                    method:"DELETE",
                    body: post   
                }),
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
                invalidatesTags:["Task"]
            }),

            getSingleTask:builder.query({
                query:(id) => {
                    return `/user/getSingleTask/${id}`
                },
                providesTags:["Task"]
            }),

            getTaskList:builder.query({
                query:() => {
                    return `/user/taskList`
                },
                providesTags:["Task"]
            }),

            deleteTask:builder.mutation({
                query:(body) => ({
                    url:`/user/deleteTask`,
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Task"]
            }),

            taskToTweet:builder.mutation({
                query:(body) => ({
                    url:`/user/taskToTweet`,
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Tweet","Task"]
            }),

            taskUpdate:builder.mutation({
                query:(body) => ({
                    url:`/user/taskUpdate`,
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Task"]
            }),

            taskImageUpdate:builder.mutation({
                query:(body) => ({
                    url:`/user/taskImageUpdate`,
                    method:"POST",
                    body:body
                }),
                invalidatesTags:["Task"]
            }),



        }
    },
})

export const {useGetDemoQuery,useUserLoginMutation,useGetTweetListQuery,useAddTweetMutation,useGetUserProfileQuery,useTweetLikeMutation,useGetUserTweetLikeListQuery,useUserTweetDislikeMutation,useGetSingleTweetQuery,useUserTweetAddCommentMutation, useTweetCommentListQuery,useUserTweetProfileQuery,useGetUserShortProfileQuery,useAddRetweetMutation,useUpdateUserProfileMutation,useGetTagListQuery,useGetUserTagListQuery,useGetSingleUserTagQuery,useAddTaskMutation,useGetTaskListQuery,useDeleteTaskMutation,useTaskToTweetMutation,useTaskUpdateMutation,useDeleteTweetMutation,useTaskImageUpdateMutation,useGetSingleTaskQuery , useGetTweetPostLikeListQuery} = userApiSlice