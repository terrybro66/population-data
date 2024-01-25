import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { PolygonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import * as d3 from "d3";

import "mapbox-gl/dist/mapbox-gl.css";

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

const polygonData = [
  {
    contours: [
      [-0.489, 51.28],
      [-0.489, 51.78],
      [0.236, 51.78],
      [0.236, 51.28],
      [-0.489, 51.28],
    ],
    height: 10000,
    name: "London",
    colour: "red",
  },
  {
    contours: [
      [-0.1, 52.0],
      [-0.1, 52.5],
      [0.5, 52.5],
      [0.5, 52.0],
      [-0.1, 52.0],
    ],
    height: 100000,
    name: "Paris",
    colour: [0, 255, 0],
  },
];
function App() {
  const [view, setView] = useState(locations["london"]);
  const [data, setData] = useState(polygonData);

  const layers = [
    new PolygonLayer({
      id: "london-polygon",
      data: polygonData,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: (d) => d.contours,
      getElevation: (d) => d.height,
      getLineColor: [250, 80, 80],
      getFillColor: (d) => d.colour,
      getLineWidth: 25,
    }),
  ];

  return (
    <DeckGL initialViewState={view} controller={true} layers={layers}>
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
}

export default App;
