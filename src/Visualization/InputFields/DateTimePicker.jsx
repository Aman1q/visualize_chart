import React from "react";
import DatePicker from "react-datepicker";

// Date Time Picker Utility Function to dyanamically accept time, setTime Function , placeholder , min & max Time
function DateTimePicker(props) {
  const { time, setTime, placeholder, minTime, maxTime } = props;
  return (
    <DatePicker
      selected={time}
      onChange={(date) => setTime(date)}
      onSelect={(date) => setTime(date)}
      locale="en-US"
      //   timeFormat="HH:mm:ss"
      placeholderText={placeholder}
      timeIntervals={1}
      showTimeSelect
      timeFormat="p"
      dateFormat="MMMM d, yyyy h:mm aa"
      style={{ width: "600px" }}
      minDate={minTime}
      maxDate={maxTime}
    />
  );
}

export default DateTimePicker;
