import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const userApiSlice = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8989'
    }),
    endpoints(build) {
        return {
            userLogin: build.mutation({
                query(userAccountInfo) {
                    return {
                        url: '/login',
                        method: 'POST',
                        body: userAccountInfo
                    }
                }
            })
        }
    }
})

export const {useUserLoginMutation} = userApiSlice
