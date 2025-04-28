// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:2000/api/air-monitoring" }),
  tagTypes: ["AirData", "AirStats", "AirDataByYear"], 
  endpoints: (builder) => ({
    getAllAirData: builder.query({
      query: () => "/get-air-data",
      providesTags: ["AirData"],
    }),
    getAirDataByYear: builder.query({
      query: ({ year, type }) => `/get-monthly-averages?year=${year}&type=${type}`,
      providesTags: ["AirDataByYear"],
    }),
    getAirStats: builder.query({
      query: () => `/get-stat-data/`, 
      providesTags: ["AirStats"],
    }), 
    getHalfHourlyAverages: builder.query({
      query: () => `/get-data-last-hour`,
      providesTags: ["AirData"],
    }),
    getControllerLocation:builder.query({
      query : () => "/get-controllers-location/"
    }),
    uploadFirmware: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: 'upload-bin-file',
          method: 'POST',
          body: formData,
        };
},
}),


    
  }),
});

export const {
  useGetAllAirDataQuery,
  useGetAirDataByYearQuery,
  useGetAirStatsQuery,
  useGetHalfHourlyAveragesQuery,
  useUploadFirmwareMutation,
  useGetControllerLocationQuery,
} = api;
