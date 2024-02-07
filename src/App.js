import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import * as d3 from "d3";
import Ajv from "ajv";

import styles from "./App.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

const ajv = new Ajv();

const locations = {
  london: {
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 9,
    pitch: 45,
    bearing: 0,
  },
  paris: {
    longitude: 2.3522,
    latitude: 48.58572,
    zoom: 10,
    pitch: 45,
    bearing: 0,
  },
};

function App() {
  const [view, setView] = useState(locations["london"]);
  const [populationData, setPopulationData] = useState(null);
  const [years, setYears] = useState([]);
  const [layerData, setLayerData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [validationError, setValidationError] = useState(null);

  const [currentYear, setCurrentYear] = useState([2000]);
  const [heightObj, setHeightObj] = useState();
  const [tooltip, setTooltip] = useState(null);

  // const schema = {
  //   type: "object",
  //   properties: {
  //     type: { type: "string" },
  //     features: { type: "array" },
  //   },
  //   required: ["type", "features"],
  // };

  useEffect(() => {
    let geojsonUrl = "https://skgrange.github.io/www/data/london_sport.json";
    let csvUrl =
      "https://data.london.gov.uk/download/land-area-and-population-density-ward-and-borough/77e9257d-ad9d-47aa-aeed-59a00741f301/housing-density-borough.csv";

    Promise.all([d3.json(geojsonUrl), d3.csv(csvUrl)])
      .then(([boroughs, populations]) => {
        setLayerData(boroughs);

        setPopulationData(populations);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    if (populationData) {
      const uniqueYears = [...new Set(populationData.map((item) => item.Year))];
      setYears(uniqueYears);
    }
  }, [populationData]);

  useEffect(() => {
    if (layerData && populationData) {
      const currentYearData = populationData.filter(
        (item) => item.Year === currentYear
      );
      const newCombinedData = layerData.features.map((feature) => {
        const name = feature.properties.name;

        const populationItem = populationData.find(
          (data) => data.Name === name && data.Year === currentYear
        );

        if (populationItem) {
          feature.properties.color = (255, 0, 0);
          feature.properties.h = populationItem.population;
        }

        return feature;
      });

      // Set the new data object to combinedData state
      setCombinedData(newCombinedData);
      console.log(combinedData);
    }
  }, [layerData, populationData, currentYear]);

  const validate = ajv.compile(schema);

  useEffect(() => {
    const valid = validate(geodata);
    if (!valid) {
      console.log(validate.errors);
    } else {
      console.log("yea");
    }
  }, [geodata]);

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geodata,
      getFillColor: (d) => d.properties.color, // Set polygons to red

      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
      },
      extruded: true,
      pickable: true,
      getElevation: (d) => d.properties.h,
      onHover: (info) => setTooltip(info),
    }),
  ];

  return (
    <div className={styles.control}>
      <select onChange={(e) => setCurrentYear(e.target.value)}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <DeckGL initialViewState={view} controller={true} layers={layers}>
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
        {tooltip && tooltip.object && (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            {/* Display tooltip content here, e.g., tooltipInfo.object.properties.name */}
          </div>
        )}{" "}
      </DeckGL>
    </div>
  );
}

export default App;
