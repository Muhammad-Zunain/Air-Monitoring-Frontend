import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import App from "./routes/App.jsx";
import "./index.css";

import  dataReducer  from "./features/data"; 
import globalReducer from "./state"; // Make sure alias is setup in vite.config.js
import { api } from './state/api'; // Adjust the path if different

const store = configureStore({
  reducer: {
    global: globalReducer,
    data: dataReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
