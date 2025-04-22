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

const AppInitializer = () => {
  const [splashDone, setSplashDone] = useState(false);
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

  // console.log("Air Data:",airData);
  // console.log("Air Stats:",airStats);
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
      console.log("✅ Air Stats received:", airStats);
      dispatch(setAirStats(airStats.data));
      dispatch(setLoading(false));
    }
  
    if (airStatsError) {
      dispatch(setError(airStatsError));
      dispatch(setLoading(false));
    }
  
    // When all loading is done & both data fetches are successful
    if (
      !airDataLoading &&
      !airStatsLoading &&
      airDataSuccess &&
      airStatsSuccess
    ) {
      console.log("🎉 All Data Fetched, Splash Done!");
      setSplashDone(true);
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
  

  if (!splashDone) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        {airDataError || airStatsError ? "Error loading data" : "Loading..."}
      </div>
    );
  }

  return <App />;
};

export default AppInitializer;
