import { createSlice } from "@reduxjs/toolkit";
function formatDateTime(timestamp) {
  const dateObj = new Date(timestamp);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const time = dateObj.toLocaleTimeString('en-US', options);
  const date = dateObj.toISOString().split('T')[0];
  return { time, date };
}
const initialState = {
  entries: [],
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: {
      reducer: (state, action) => {
        state.entries = action.payload;
        state.isLoading = false;
      },
      prepare: (rawData) => {
        const converted = rawData.map((item) => {
          const { time, date } = formatDateTime(item.timestamp);
          return {
            ...item,
            time,
            date,
          };
        })
        return { payload: converted };
      },
    },
    setAirDataLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAirDataError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setData ,setAirDataLoading, setAirDataError } = dataSlice.actions;
export default dataSlice.reducer;
