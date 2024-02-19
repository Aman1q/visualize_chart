// Visualization.js
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import {
  chartOptionsData,
  colors,
  keys,
  meterOptionsData,
} from "../Constant/data.js";
import MultiBarChart from "./Charts/MultiBarChart.jsx";
import MultiLineChart from "./Charts/MultiLineChart.jsx";
import DateTimePicker from "./InputFields/DateTimePicker.jsx";
import SelectPicker from "./InputFields/SelectPicker.jsx";
import {
  getChartData,
  getInitialAlertValue,
  getInitialGraphValue,
  getIntialMeterValue,
} from "./utils.js";
import "./visualize.css";

const Visualization = () => {
  // Filter States -: Start Time, End Time, Selected Meters , Selected Graph Type
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedMeters, setSelectedMeters] = useState(getIntialMeterValue());
  const [selectedGraph, setSelectedGraph] = useState(getInitialGraphValue());
  const showAlertWidget = getInitialAlertValue();
  // State to change color of graph
  const [filterColors, setFilterColors] = useState(colors);
  // Get chart Filtered Data
  const chartData = getChartData(startTime, endTime, selectedMeters);

  //Render Different Chart
  const renderChart = (graphType) => {
    const commonProps = {
      data: chartData,
      selectedMeters,
      colors: filterColors,
      keys,
      showAlertWidget,
    };
    switch (graphType) {
      case "Line":
        return <MultiLineChart {...commonProps} />;
      case "Bar":
        return <MultiBarChart {...commonProps} />;
      default:
        return <></>;
    }
  };

  // Handle Color Change -> Function called when we try to update color
  const handleColorFilterChange = (e, key) => {
    setFilterColors((prev) => {
      const rep = { ...prev };
      prev[key] = e.target.value;
      return rep;
    });
  };

  return (
    <div className="visualization-container">
      <Link to={"/configure"}> Configure Settings </Link>
      <h1>Data Visualization Assignment</h1>
      <div className="input_filters">
        <DateTimePicker
          time={startTime}
          setTime={setStartTime}
          placeholder={"Select Start Time"}
          maxTime={endTime}
        />
        <DateTimePicker
          time={endTime}
          setTime={setEndTime}
          placeholder={"Select End Time"}
          minTime={startTime}
        />
        <SelectPicker
          data={selectedMeters}
          setData={setSelectedMeters}
          optionsData={meterOptionsData}
          multiSelect={true}
        />
        <SelectPicker
          data={selectedGraph}
          setData={setSelectedGraph}
          optionsData={chartOptionsData}
          multiSelect={true}
        />{" "}
      </div>
      <div className="filter_colors">
        {Object.keys(colors)?.map((key) => {
          return (
            <div>
              {key}:
              <input
                type="color"
                defaultValue={colors[key]}
                onChange={(e) => {
                  handleColorFilterChange(e, key);
                }}
              ></input>
            </div>
          );
        })}
      </div>
      <div
        className={
          showAlertWidget
            ? "visualisation_charts_horiz"
            : "visualisation_charts"
        }
      >
        {selectedGraph?.map((graphType) => {
          return renderChart(graphType);
        })}
      </div>
    </div>
  );
};

export default Visualization;
