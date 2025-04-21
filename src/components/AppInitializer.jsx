import React, { useState, useEffect } from "react";
import { useGetAllAirDataQuery, useGetAirStatsQuery } from "../state/api";
import { useDispatch } from "react-redux";
import { setData, setAirDataLoading, setAirDataError } from "../features/data.Slice";
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

  console.log("Air Data:", airStatsSuccess);

  useEffect(() => {
    if (!airDataLoading ) {
      dispatch(setAirDataLoading(true));
    } else {
      dispatch(setAirDataLoading(false));
      if (airData) dispatch(setData(airData));
      if (airDataError) dispatch(setAirDataError(airDataError));
    }

    if (!airStatsLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
      if (airStats) dispatch(setAirStats(airStats));
      if (airStatsError) dispatch(setError(airStatsError));
    }

    // console.log("Air Data:", airDataLoading, airDataError);
    // console.log("Air Stats:", airStatsLoading, airStatsError);

    // Show App after both done
    if (!airDataLoading && !airStatsLoading && airDataSuccess && airStatsSuccess) {
      console.log("Air Data:");
      setSplashDone(true);
    }
  }, [
    airData,
    airStats,
    airDataLoading,
    airStatsLoading,
    airDataError,
    airStatsError,
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
