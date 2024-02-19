import { MeterPowerData } from "../Constant/data";

export const getChartData = (startDate = 0, endDate = "2050, 0, 1") => {
  // Convert start and end dates to Date objects
  const startDateObj = startDate || new Date(0);
  const endDateObj = endDate || new Date(2050, 0, 1);

  // Filter data based on start and end dates
  const filteredData = MeterPowerData.filter((entry) => {
    // Convert Timestamp to Date object
    const timestamp = extractDate(entry.Timestamp);

    // Check if timestamp is between start and end dates
    return timestamp >= startDateObj && timestamp <= endDateObj; // Check if timestamp is between start and end dates
  });
  return filteredData;
};

export const extractDate = (date) => {
  const [dateString, timeString] = date.split(" ");
  const [day, month, year] = dateString.split("-");
  const [hour, minute] = timeString.split(":");
  return new Date(year, month - 1, day, hour, minute);
};

export const getColor = (meter, colors) => colors[meter];

export const calculateAlerts = (cumulativePower) => {
  const lineAlerts = [];
  const leakageAlerts = [];
  Object.entries(cumulativePower).forEach(([timestamp, obj]) => {
    const { power, tStamp, clusterPower } = cumulativePower[timestamp];
    if (power > 1000) {
      lineAlerts.push({ timestamp, power, tStamp });
    }
    if (clusterPower - power > 300) {
      leakageAlerts.push({ timestamp, power, tStamp, clusterPower });
    }
  });
  return { lineAlerts, leakageAlerts };
};
export const getIntialMeterValue = () => {
  return localStorage.getItem("selectedMeters")
    ? JSON.parse(localStorage.getItem("selectedMeters"))
    : ["M1 Power"];
};

export const getInitialGraphValue = () => {
  return localStorage.getItem("selectedGraph")
    ? JSON.parse(localStorage.getItem("selectedGraph"))
    : ["Line"];
};

export const getInitialAlertValue = () => {
  const showAlerts = localStorage.getItem("showAlerts");
  return showAlerts ? (showAlerts === "false" ? false : true) : true;
};
