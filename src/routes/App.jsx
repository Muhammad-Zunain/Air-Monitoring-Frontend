import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "../theme.js";
import { useSelector } from "react-redux";
import Layout from "../pages/layout/Layout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Geography from "../pages/Geography.jsx";
import Humidity from "../pages/Humidity.jsx";
import Dust from "../pages/Dust.jsx";
import Temperature from "../pages/Temperature.jsx";
import Setting from  "../pages/ESPSetting.jsx"


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <>
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/geography" element={<Geography/>} />
                <Route path="/temperature" element={<Temperature />} />
                <Route path="/humidity" element={<Humidity />} />
                <Route path="/dust" element={<Dust />} />
                <Route path="/setting" element={<Setting/>} />
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
