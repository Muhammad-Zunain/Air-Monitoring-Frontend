import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    dataBarType: {year:"2024", type:"temperature"}, // Default type and year
    loading: false,
    error: null,
    };

const dataBarTypeSlice = createSlice({
    name: 'dataBarType',
    initialState,
    reducers: {
        setDataBarType: (state, action) => {
            state.dataBarType = action.payload;
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


export const { setDataBarType, setLoading, setError } = dataBarTypeSlice.actions;
export default dataBarTypeSlice.reducer;