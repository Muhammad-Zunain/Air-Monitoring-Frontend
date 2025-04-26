import React, { useState, useEffect } from "react";
import { useGetAllAirDataQuery, useGetAirStatsQuery } from "../state/api";
import { useDispatch } from "react-redux";
import {
  setData,
  setAirDataLoading,
  setAirDataError,
} from "../features/data.Slice";
import { setAirStats, setLoading, setError } from "../features/airStat.Slice";
import App from "../routes/App.jsx";
import SplashScreen from "./SplashScreen.jsx";

const AppInitializer = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true); 
  const dispatch = useDispatch();

  const {
    data: airData,
    isLoading: airDataLoading,
    error: airDataError,
    isSuccess: airDataSuccess,
  } = useGetAllAirDataQuery();

  const {
    data: airStats,
    isLoading: airStatsLoading,
    error: airStatsError,
    isSuccess: airStatsSuccess,
  } = useGetAirStatsQuery();

  useEffect(() => {
    if (airData) {
      dispatch(setData(airData.data));
      dispatch(setAirDataLoading(false));
    }

    if (airDataError) {
      dispatch(setAirDataError(airDataError));
      dispatch(setAirDataLoading(false));
    }

    if (airStats) {
      dispatch(setAirStats(airStats.data));
      dispatch(setLoading(false));
    }

    if (airStatsError) {
      dispatch(setError(airStatsError));
      dispatch(setLoading(false));
    }

    if (
      !airDataLoading &&
      !airStatsLoading &&
      airDataSuccess &&
      airStatsSuccess
    ) {
      setTimeout(() => {
        setShowSplashScreen(false);
      }, 5000);
    }
  }, [
    airData,
    airStats,
    airDataError,
    airStatsError,
    airDataLoading,
    airStatsLoading,
    airDataSuccess,
    airStatsSuccess,
    dispatch,
  ]);

  if (showSplashScreen) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        {airDataError || airStatsError ? (
          "Error loading data"
        ) : (
          <SplashScreen  />
        )}
      </div>
    );
  }

  return <App />;
};

export default AppInitializer;
