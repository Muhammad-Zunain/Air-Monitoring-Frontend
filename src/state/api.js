import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/air-monitoring" }),
  reducerPath: "Api",
  tagTypes: ["User", "AirData", "AirQuality"],
  endpoints: builder => ({
    getAirData: builder.query({
      query: () => `/add-air-data/`,
      providesTags: ["User"],
    })
    }),
});

export const {
    

} = api;
