import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "deck.gl";
import { Map } from "react-map-gl";
import * as d3 from "d3";
import Ajv from "ajv";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./App.module.css";

import { geodata, schema, locations } from "./assets";
const ajv = new Ajv();
const years = d3.range(2010, 2020);

function App() {
  const [view, setView] = useState(locations["london"]);
  const [data, setData] = useState(geodata);
  const [year, setYear] = useState(2019);

  const validate = ajv.compile(schema);
  useEffect(() => {
    const valid = validate(geodata);
    if (!valid) {
      console.log("EEEEEEEE", validate.errors);
    } else {
      console.log("yea");
    }
  }, [geodata]);

  useEffect(() => {
    let geojsonUrl = "https://skgrange.github.io/www/data/london_sport.json";
    let csvUrl =
      "https://data.london.gov.uk/download/land-area-and-population-density-ward-and-borough/77e9257d-ad9d-47aa-aeed-59a00741f301/housing-density-borough.csv";
  }, []);
  useEffect(() => {
    console.log(years);
  }, []);

  const handleFlyTo = (destination) => {
    setView({
      ...view,
      ...destination,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const changeH = () => {
    const newData = {
      ...data,
      features: data.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          h: 15000,
        },
      })),
    };
    setData(newData);
  };
  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data,
      getElevation: (f) => f.properties.h,
      getFillColor: (d) => d.properties.color, // Set polygons to red
      updateTriggers: {
        getElevation: data.features.map((feature) => feature.properties.h),
      },
      transitions: {
        getElevation: 1500,
      },
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
      },
      extruded: true,
      pickable: true,
      getElevation: (d) => d.properties.h,
    }),
  ];

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
      </div>
      <div className={styles.yearControl}>
        <button onClick={changeH}>Change H</button>
      </div>

      <DeckGL
        initialViewState={view}
        onViewStateChange={({ viewState }) => setView(viewState)} // use viewState instead of view
        controller={true}
        layers={layers}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </>
  );
}

export default App;
