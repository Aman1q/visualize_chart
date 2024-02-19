import React from "react";

// Select Picker -> Utility Function to drop multi dropdown or simple options list
const SelectPicker = (props) => {
  const { data, setData, optionsData, multiSelect } = props;
  const handleChange = (event) => {
    if (multiSelect) {
      const selectedValues = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      setData(selectedValues);
    } else {
      setData(event.target.value);
    }
  };

  return (
    <div>
      <select multiple={multiSelect} onChange={handleChange}>
        {optionsData.map((option) => (
          <option
            key={option.value}
            value={option.value}
            selected={
              multiSelect ? data.includes(option.value) : data === option.value
            }
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectPicker;
