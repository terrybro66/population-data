import React from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { FlyToInterpolator } from "deck.gl";
import { GeoJsonLayer } from "@deck.gl/layers";

const MyMap = ({ data, location }) => {
  const onHover = ({ x, y, object }) => {
    console.log(object.properties.name);
  };
  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data,
      getFillColor: [255, 0, 0],
      extruded: true,
      pickable: true,
      stroked: true,
      getElevation: (d) => d.properties.height * 0.05,
      transitions: {
        getElevation: 1000,
      },
      // onHover,
    }),
  ];

  return (
    <div>
      <DeckGL initialViewState={location} controller={true} layers={layers}>
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};

export default MyMap;
