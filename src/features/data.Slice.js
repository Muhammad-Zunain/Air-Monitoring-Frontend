import { createSlice } from "@reduxjs/toolkit";
function formatDateTime(timestamp) {
  const dateObj = new Date(timestamp);

  // Format time to hh:mm AM/PM
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const time = dateObj.toLocaleTimeString('en-US', options);

  // Format date to yyyy-mm-dd
  const date = dateObj.toISOString().split('T')[0];

  return { time, date };
}
// const dummyData = [
//   {
//     _id: "a0df300b-d556-4f2d-a576-56b7ac6625a2",
//     date: "2025-03-01",
//     time: "12:00 AM",
//     temperature: "22.5",
//     humidity: "58.6",
//     dust: "8.5",
//   },
//   {
//     _id: "38d48927-09c7-43a7-b254-da4bf78ca630",
//     date: "2025-03-01",
//     time: "01:00 AM",
//     temperature: "26.9",
//     humidity: "61.4",
//     dust: "8.5",
//   },
//   {
//     _id: "cb900a51-816a-444a-9a27-007efd0c8d52",
//     date: "2025-03-01",
//     time: "02:00 AM",
//     temperature: "25.1",
//     humidity: "67.7",
//     dust: "6.3",
//   },
//   {
//     _id: "5dd9c3dd-5e19-457e-8dcd-e86f8a09afcd",
//     date: "2025-03-01",
//     time: "03:00 AM",
//     temperature: "20.7",
//     humidity: "48.3",
//     dust: "5.5",
//   },
//   {
//     _id: "49cf41b2-7fc2-4151-9643-7727146b7a82",
//     date: "2025-03-01",
//     time: "04:00 AM",
//     temperature: "23.2",
//     humidity: "51.6",
//     dust: "9.5",
//   },
// ];
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
        console.log("Converted Data:", converted);
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
