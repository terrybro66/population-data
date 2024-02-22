import React from "react";
import styles from "./YearSelector.module.css";

const YearSelector = ({ years, handleYearChange, currentYear }) => {
  return (
    <div className={styles.container}>
      <select onChange={(e) => handleYearChange(e)} value={currentYear}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
