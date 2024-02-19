# Data Visualization Project

### This assignment involves creating a data visualization solution using React and D3.js to monitor voltage consumption across multiple meters. Through interactive charts, filtering options, and alert functionalities, users can analyze power consumption trends efficiently.

## Setup Instructions

To set up the project, follow these steps:

1. Begin by using create-react-app to create a new React project:
   npx create-react-app visualize
2. Install the necessary libraries:

   - D3.js: For creating interactive charts.
   - React Router Dom: For managing routing within the application.
   - React-datepicker: For integrating a date and time picker component.

3. Define the folder structure as follows:
   - `src/Visualization/index.js`: Main rendering page.
   - `src/Charts/`: Contains all chart components.
   - `src/InputFields/`: Includes input fields like DateTimePicker and SelectPicker.
   - `src/utils.js`: Utility functions.
   - `src/constants/`: Contains project constants.
   - `src/Configuration/index.jsx`: Main configuration page.

## Data Visualization Assignment

### Routes

- **/pages/visualize**:This route facilitates the visualization of voltage consumption across meters.
  - Filters available: Start Time, End Time, Select Meters (M1, M2, M3, M4), Selected Graph Type (Line, Stacked Bar).
  - Functionality to change the color of lines representing different meters in the chart.

#### Date Time Picker

- Utility functions dynamically accept time, setTime function, placeholder, min & max time for the DateTimePicker component.

#### Alert Boxes

1. **Power Alerts**: Displays a list of alerts where the sum of all selected meters' power consumption is greater than 1000W.
2. **Leaked Power Alerts**: Lists alerts where the sum of all selected meter differences in cluster meter power is greater than 300W.
   - Upon clicking a specific alert, the corresponding segment on the line chart highlights, and the text color on the alert sheet also highlights.

#### Tooltip Functionality

- Shows a tooltip when hovering over the chart, indicating power, timestamp, and machine details.

### Configuration Page

- **/pages/configuration**: Allows users to configure basic settings like the selected meter, show Alert Boxes and default chart type. Local Storage is utilized to handle these configurations persistently.
