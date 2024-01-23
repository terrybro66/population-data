import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";

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

  return (
    <DeckGL initialViewState={view} controller={true}>
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
}

export default App;
