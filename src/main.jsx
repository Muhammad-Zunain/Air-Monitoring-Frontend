import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";


import "./index.css";

import dataReducer from "./features/data.Slice.js"; 
import statDataReducer from "./features/airStat.Slice.js"; 
import globalReducer from "./features/index.js";
import dataBarTypeReducer from "./features/dataBarType.Slice.js";
import { api } from './state/api'; 
import AppInitializer from "./components/AppInitializer.jsx";

const store = configureStore({
  reducer: {
    global: globalReducer,
    data: dataReducer,
    stats: statDataReducer,
    AvgData: dataBarTypeReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  </StrictMode>
);
