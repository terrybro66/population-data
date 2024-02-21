import React, { useState, useEffect } from "react";
import { FlyToInterpolator } from "deck.gl";

import * as d3 from "d3";
import CitySelector from "./components/citySelector/CitySelector";
import Map from "./components/map/Map2";
import "mapbox-gl/dist/mapbox-gl.css";

const cities = {
  london: {
    longitude: -0.1275,
    latitude: 51.5072,
    files: {
      json: "https://raw.githubusercontent.com/radoi90/housequest-data/master/london_boroughs.geojson",
      csv: "https://data.london.gov.uk/download/land-area-and-population-density-ward-and-borough/77e9257d-ad9d-47aa-aeed-59a00741f301/housing-density-borough.csv",
    },
  },
  paris: {
    longitude: 2.3437000259755507,
    latitude: 48.85608836457078,
    files: {
      json: "https://raw.githubusercontent.com/blackmad/neighborhoods/master/paris.geojson",
      csv: "https://data.london.gov.uk/download/land-area-and-population-density-ward-and-borough/77e9257d-ad9d-47aa-aeed-59a00741f301/housing-density-borough.csv",
    },
  },
};

function App() {
  const initiaViewState = {
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 10,
    pitch: 50,
    bearing: 0,
    transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
    transitionDuration: "auto",
  };
  const [viewState, setViewState] = useState(initiaViewState);
  const [city, setCity] = useState("london");
  const [year, setYear] = useState(2020);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function combineData(geoData, populationData) {
    console.log(populationData);
    const newCombinedData = geoData.features.map((feature) => {
      const name = feature.properties.name;
      const populationItem = populationData.find(
        (data) => data.Name === name && Number(data.Year) === year
      );

      if (populationItem) {
        feature.properties.color = (55, 100, 0);
        feature.properties.height = populationItem.Population;
      }

      return feature;
    });

    return newCombinedData;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const dataJson = await d3.json(cities[city].files.json);
      const dataCsv = await d3.csv(cities[city].files.csv);
      const combinedData = combineData(dataJson, dataCsv);

      setData((prevData) => ({
        ...prevData,
        combinedData,
      }));

      setIsLoading(false);
    };

    fetchData();
  }, [city]);

  const handleCityChange = (city) => {
    const location = cities[city];

    setViewState({
      ...viewState,
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  return (
    <div className="App">
      <CitySelector
        cities={cities}
        year={year}
        onCityChange={handleCityChange}
        onYearChange={handleYearChange}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Map location={viewState} data={data} />
      )}
    </div>
  );
}

export default App;
