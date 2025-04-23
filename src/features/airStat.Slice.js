// src/features/airStats/airStatsSlice.js
import { createSlice } from "@reduxjs/toolkit";

// const dummystats = {
//   temperature: [
//      {
//       title: "Current Temperature",
//       value: 25.1,
//       increase: "6.98%", // Calculated as an increase from previous value
//       description: "Since last record",
//       icon: "temperature", // This could be an icon you associate with temperature
//     },
//     {
//       title: "Highest Temperature Today",
//       value: 28.3,
//       increase: "12.74%", // Calculated from current value to highest
//       description: "Since last record",
//       icon: "up", // Icon representing an increase
//     },
//    {
//       title: "Lowest Temperature Today",
//       value: 22.5,
//       increase: "-10.29%", 
//       description: "Since last record",
//       icon: "down", // Icon representing a decrease
//     },
//   ],
// };

const initialState = {
  statsData: {},
  loading: true,
  error: null,
};

const airStatsSlice = createSlice({
  name: "airStats",
  initialState,
  reducers: {
    setAirStats: (state, action) => {
      state.statsData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAirStats, setLoading, setError } = airStatsSlice.actions;
export default airStatsSlice.reducer;
