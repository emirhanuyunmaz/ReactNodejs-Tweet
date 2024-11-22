import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"

const baseUrl = import.meta.env.VITE_BASE_URL

export const contactApiSlice = createApi({
    reducerPath:"contactApi",
    tagTypes:["contact"],
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
            })
        }
    }
})

export const {useFollowUserMutation,useUnfollowUserMutation,useIsFollowUserQuery,useSearchUserMutation} = contactApiSlice