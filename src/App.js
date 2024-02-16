import React, { useState } from "react";

import CitySelector from "./components/citySelector/CitySelector";
import DataLayer from "./components/dataLayer/DataLayer";
import Map from "./components/map/Map";

function App() {
  const [currentCity, setCurrentCity] = useState("London");
  const [activeLayers, setActiveLayers] = useState();

  const cities = [
    { name: "Toronto", id: "34793" },
    { name: "New York City", id: "1825306" },
  ];

  const handleCityChange = (newCity) => {
    setCurrentCity(newCity);
  };

  return (
    <div>
      <CitySelector
        cities={cities}
        currentCity={currentCity}
        onCityChange={handleCityChange}
      />
      <DataLayer activeLayers={activeLayers} />
      <Map city={currentCity} activeLayers={activeLayers} />
    </div>
  );
}
export default App;
