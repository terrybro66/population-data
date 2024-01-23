import React from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
function App() {
  return (
    <DeckGL>
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
}

export default App;
