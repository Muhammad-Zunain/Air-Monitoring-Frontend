// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:2000/api/air-monitoring" }),
  tagTypes: ["AirData", "AirStats"], 
  endpoints: (builder) => ({
    getAllAirData: builder.query({
      query: () => "/get-air-data/",
      providesTags: ["AirData"],
    }),
    getAirDataByYear: builder.query({
      query: (year) => `/filter-by-year/${year}`,
      providesTags: ["AirData"],
    }),
    getAirStats: builder.query({
      query: () => `/get-stat-data/`, 
      providesTags: ["AirStats"],
    }),
  }),
});

export const {
  useGetAllAirDataQuery,
  useGetAirDataByYearQuery,
  useGetAirStatsQuery,
} = api;
