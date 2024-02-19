import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

const LineChart = ({ data, selectedMeters }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Parse timestamp and power values
    const formattedData = data.map((d) => ({
      timestamp: d3.timeParse("%d-%m-%Y %H:%M")(d.Timestamp),
      power: d[selectedMeters],
    }));

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

    const line = d3
      .line()
      .x((d) => x(d.timestamp))
      .y((d) => y(d.power));

    x.domain(d3.extent(formattedData, (d) => d.timestamp));
    y.domain([0, d3.max(formattedData, (d) => d.power)]);

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

    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Create and initialize the tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Create invisible rectangle overlay to capture mouse events
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => tooltip.style("display", "block"))
      .on("mouseout", () => tooltip.style("display", "none"))
      .on("mousemove", function (event) {
        const bisectDate = d3.bisector((d) => d.timestamp).left;
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

        tooltip
          .html(`Timestamp: ${formattedDate}<br>Power: ${d.power} Watts`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 110}px`);
      });

    // Cleanup
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid black",
          borderRadius: "8px",
        }}
      ></div>
    </div>
  );
};

export default LineChart;
