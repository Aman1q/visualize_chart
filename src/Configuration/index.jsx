import React, { useEffect, useState } from "react";
import {
  alertOptionsData,
  chartOptionsData,
  meterOptionsData,
} from "../Constant/data";
import SelectPicker from "../Visualization/InputFields/SelectPicker";
import {
  getInitialAlertValue,
  getInitialGraphValue,
  getIntialMeterValue,
} from "../Visualization/utils";
import "./configure.css";

function Configuration(props) {
  const [selectedMeters, setSelectedMeters] = useState(getIntialMeterValue());
  const [selectedGraph, setSelectedGraph] = useState(getInitialGraphValue());
  const [showAlertWidget, setShowAlertWidget] = useState(
    getInitialAlertValue()
  );

  useEffect(() => {
    localStorage.setItem("selectedMeters", JSON.stringify(selectedMeters));
    localStorage.setItem("selectedGraph", JSON.stringify(selectedGraph));
    localStorage.setItem("showAlerts", showAlertWidget);
  }, [selectedMeters, selectedGraph, showAlertWidget]);
  const handleBack = () => {
    window.history.go(-1);
  };
  return (
    <div className="configure_container">
      <p onClick={handleBack}> &larr; Go Back </p>
      <h1>Configure your Settings</h1>
      <div className="input_filters">
        <div className="filter">
          Select Default Selected Meter{" "}
          <SelectPicker
            data={selectedMeters}
            setData={setSelectedMeters}
            optionsData={meterOptionsData}
            multiSelect={true}
          />
        </div>
        <div className="filter">
          Select Default Selected Graph
          <SelectPicker
            data={selectedGraph}
            setData={setSelectedGraph}
            optionsData={chartOptionsData}
            multiSelect={true}
          />{" "}
        </div>
        <div className="filter">
          Show Alert Widget
          <SelectPicker
            data={showAlertWidget}
            setData={setShowAlertWidget}
            optionsData={alertOptionsData}
            multiSelect={false}
          />{" "}
        </div>
      </div>
    </div>
  );
}

export default Configuration;
