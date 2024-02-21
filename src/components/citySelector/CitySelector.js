import React from "react";
import styles from "./CitySelector.module.css";

const CitySelector = ({ cities, onCityChange }) => {
  return (
    <div className={styles.locationControl}>
      {Object.keys(cities).map((city) => {
        return (
          <button key={city} onClick={() => onCityChange(city)}>
            {city}
          </button>
        );
      })}
    </div>
  );
};

export default CitySelector;
