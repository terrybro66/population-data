import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import { FlyToInterpolator } from "deck.gl";
import * as d3 from "d3";
import Ajv from "ajv";

import styles from "./App.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

const ajv = new Ajv({ allErrors: true });

const locations = {
  london: {
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 8,
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
  const [layerData, setLayerData] = useState([]);
  const [currentYear, setCurrentYear] = useState(2000);
  const [combinedData, setCombinedData] = useState([]);
  const [years, setYears] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [validated, setValidated] = useState(false);

  const schema = {
    type: "object",
    properties: {
      type: {
        type: "string",
      },
      properties: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          color: {
            type: "integer",
          },
          height: {
            type: "string",
          },
        },
        required: ["name", "color", "height"],
      },
      geometry: {
        type: "object",
        properties: {
          type: {
            type: "string",
          },
          coordinates: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "array",
                items: [
                  {
                    type: "number",
                  },
                  {
                    type: "number",
                  },
                ],
                minItems: 2,
                maxItems: 2,
              },
            },
          },
        },
        required: ["type", "coordinates"],
      },
    },
    required: ["type", "properties", "geometry"],
  };

  useEffect(() => {
    let geojsonUrl =
      "https://raw.githubusercontent.com/radoi90/housequest-data/master/london_boroughs.geojson";
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
    if (layerData && populationData) {
      const newCombinedData = layerData.features.map((feature) => {
        const name = feature.properties.name;

        const populationItem = populationData.find(
          (data) => data.Name === name && Number(data.Year) === currentYear
        );

        if (populationItem) {
          feature.properties.color = (55, 100, 0);
          feature.properties.height = populationItem.Population;
        }

        return feature;
      });

      setCombinedData(newCombinedData);
    }
  }, [layerData, populationData, currentYear]);

  const validate = ajv.compile(schema);

  useEffect(() => {
    if (combinedData) {
      const valid = validate(combinedData[0]);
      if (!valid) {
        setValidated(false);
      } else {
        setValidated(true);
      }
    }
  }, [combinedData]);

  useEffect(() => {
    if (populationData) {
      const uniqueYears = [...new Set(populationData.map((item) => item.Year))];
      setYears(uniqueYears);
    }
  }, [populationData]);

  const handleFlyTo = (destination) => {
    setView({
      ...destination,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  const handleYearChange = (e) => {
    setCurrentYear(Number(e.target.value));
  };
  function getRandomColor() {
    return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
  }
  const onHover = ({ object, x, y }) => {
    if (object && object.properties) {
      const polygonName = object.properties.name;
      console.log(`Hovered over polygon: ${polygonName}`);
    }
  };

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: combinedData,
      getFillColor: [255, 0, 0],
      extruded: true,
      pickable: true,
      stroked: true,
      getElevation: (d) => d.properties.height * 0.05,
      transitions: {
        getElevation: 1000, // animate for 1000ms
      },
      getTooltip: ({ object }) => {
        if (object && object.properties) {
          const polygonName = object.properties.name;
          return `Polygon: ${polygonName}`;
        }
        return null; // No tooltip if not hovering
      },
      onHover,
    }),
  ];
  if (!validated) {
    return (
      <div className={styles.jsonNotValid}>
        <h1>Error</h1>
        <p>JSON validation failed with the following errors:</p>
        <pre>{JSON.stringify(validate.errors, null, 2)}</pre>
      </div>
    );
  }
  return (
    <>
      <div className={styles.locationControl}>
        {Object.keys(locations).map((location) => {
          return (
            <button
              key={location}
              onClick={() => handleFlyTo(locations[location])}
            >
              {location}
            </button>
          );
        })}
        <select onChange={(e) => handleYearChange(e)} value={currentYear}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div id="tooltip" className={styles.tool}>
        {tooltip && tooltip.object && tooltip.object.properties && (
          <div>
            <p>{tooltip.object.properties.name}</p>
            <p>{tooltip.object.properties.height}</p>
          </div>
        )}
      </div>

      <DeckGL initialViewState={view} controller={true} layers={layers}>
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </>
  );
}

export default App;
