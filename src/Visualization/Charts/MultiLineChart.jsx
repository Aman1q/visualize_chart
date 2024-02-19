import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { calculateAlerts, getColor } from "../utils";
import "./lineChart.css";

const LineChart = ({ data, selectedMeters, colors, showAlertWidget }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [alerts, setAlerts] = useState([]);
  const [leakAlerts, setLeakAlerts] = useState([]);
  const [highlighedTimeStamp, setHighlightedTimeStamp] = useState({
    alert: null,
    leakAlert: null,
  });

  useEffect(() => {
    if (!data || !selectedMeters.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const bisectDate = d3.bisector((d) => d.timestamp).left;

    const cumulativePower = {}; // Store cumulative power for each timestamp

    selectedMeters.forEach((meter) => {
      const formattedData = data.map((d) => ({
        timestamp: d3.timeParse("%d-%m-%Y %H:%M")(d.Timestamp),
        power: d[meter],
        clusterPower: d["Cluster Meter Power (Watts)"],
      }));

      formattedData.forEach((d) => {
        if (!cumulativePower[d.timestamp]) {
          cumulativePower[d.timestamp] = {};
        }
        cumulativePower[d.timestamp]["power"] =
          (cumulativePower?.[d.timestamp]?.["power"] || 0) + d.power;
      });
      x.domain(d3.extent(formattedData, (d) => d.timestamp));
      y.domain([0, d3.max(formattedData, (d) => d.power)]);

      const line = d3
        .line()
        .x((d) => {
          cumulativePower[d.timestamp]["tStamp"] = x(d.timestamp);
          cumulativePower[d.timestamp]["clusterPower"] = d.clusterPower;
          return x(d.timestamp);
        })
        .y((d) => y(d.power));

      svg
        .append("path")
        .datum(formattedData)
        .attr("fill", "none")
        .attr("stroke", getColor(meter, colors))
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .on("mouseover", (event, d) => {
          tooltipRef.current.style.display = "block";
        })
        .on("mousemove", (event, de) => {
          const mouseX = d3.pointer(event)[0];
          const x0 = x.invert(mouseX);
          const index = bisectDate(formattedData, x0, 1);
          const d0 = formattedData[index - 1];
          const d1 = formattedData[index];
          const d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
          const dateObject = new Date(d.timestamp);

          const formattedDate =
            dateObject.toDateString() +
            " " +
            dateObject.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

          tooltipRef.current.innerHTML = `${formattedDate}<br>${meter}<br>Power: ${d.power} Watts`;
          tooltipRef.current.style.left = `${event.pageX}px`;
          tooltipRef.current.style.top = `${event.pageY - 200}px`;
        })
        .on("mouseout", () => {
          tooltipRef.current.style.display = "none";
        })
        .on("click", (event) => {
          const mouseX = d3.pointer(event)[0];
          const x0 = x.invert(mouseX);
          const index = bisectDate(formattedData, x0, 1);
          const d0 = formattedData[index - 1];
          const d1 = formattedData[index];
          const d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
          const dateObject = new Date(d.timestamp);

          const formattedDate =
            dateObject.toDateString() +
            " " +
            dateObject.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
          alert(`${formattedDate} | ${meter} | Power: ${d.power} Watts`);
        });
    });

    // Calculate alerts
    const { lineAlerts, leakageAlerts } = calculateAlerts(cumulativePower);
    setAlerts(lineAlerts);
    setLeakAlerts(leakageAlerts);

    // Add Labels
    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
    svg.append("g").call(yAxis);
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom - 5)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Timestamp");

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Power (Watts)");

    svg.selectAll(".vertical-line").remove();

    if (highlighedTimeStamp.alert) {
      svg
        .append("line")
        .attr("class", "vertical-line")
        .attr("x1", highlighedTimeStamp.alert)
        .attr("y1", 0)
        .attr("x2", highlighedTimeStamp.alert)
        .attr("y2", height)
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", "4");
    }
    if (highlighedTimeStamp.leakAlert) {
      svg
        .append("line")
        .attr("class", "vertical-line")
        .attr("x1", highlighedTimeStamp.leakAlert)
        .attr("y1", 0)
        .attr("x2", highlighedTimeStamp.leakAlert)
        .attr("y2", height)
        .attr("stroke", "purple")
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", "4");
    }

    // Cleanup
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [data, selectedMeters, highlighedTimeStamp, colors]);

  const handleAlertClick = (timestamp, type) => {
    // Handle click on alert
    setHighlightedTimeStamp((prev) => {
      let obj = { ...prev };
      obj[type] = timestamp;
      return obj;
    });
  };

  return (
    <div className="line_chart_cover">
      <div className="chart_cover">
        <svg ref={svgRef}></svg>
        <div ref={tooltipRef} className="tool_tip_style"></div>
      </div>
      {showAlertWidget && selectedMeters.length > 0 ? (
        <>
          <div className="alerts_cover">
            <h3>Alerts</h3>
            <ul>
              {alerts?.length === 0 ? "No Alerts Found" : ""}
              {alerts.map((alert, index) => (
                <li
                  key={index}
                  onClick={() => handleAlertClick(alert.tStamp, "alert")}
                  style={
                    alert.tStamp === highlighedTimeStamp.alert
                      ? { color: "red" }
                      : null
                  }
                >
                  Timestamp: {alert.timestamp}
                  <br />
                  Power: {alert.power}
                </li>
              ))}
            </ul>
          </div>

          <div className="alerts_cover">
            <h3>Cluster Alerts</h3>
            <ul>
              {leakAlerts?.length === 0 ? "No Alerts Found" : ""}
              {leakAlerts.map((alert, index) => (
                <li
                  key={index}
                  onClick={() => handleAlertClick(alert.tStamp, "leakAlert")}
                  style={
                    alert.tStamp === highlighedTimeStamp.leakAlert
                      ? { color: "purple" }
                      : null
                  }
                >
                  Timestamp: {alert.timestamp}
                  <br /> Cluster Power: {alert.clusterPower} <br />
                  Power :{alert.power}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LineChart;
