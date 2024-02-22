import React, { useState, useEffect } from "react";
import { FlyToInterpolator } from "deck.gl";
import * as d3 from "d3";
import CitySelector from "./components/citySelector/CitySelector";
import YearSelector from "./components/yearSelector/YearSelector";
import Map from "./components/map/Map2";
import "mapbox-gl/dist/mapbox-gl.css";

const cities = {
  london: {
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 9,
    files: {
      json: "https://raw.githubusercontent.com/radoi90/housequest-data/master/london_boroughs.geojson",
      csv: "https://data.london.gov.uk/download/land-area-and-population-density-ward-and-borough/77e9257d-ad9d-47aa-aeed-59a00741f301/housing-density-borough.csv",
    },
  },
  paris: {
    longitude: 2.3437000259755507,
    latitude: 48.85608836457078,
    zoom: 11,
    files: {
      json: "https://raw.githubusercontent.com/blackmad/neighborhoods/master/paris.geojson",
      csv: "/parisPop.csv",
    },
  },
};

function App() {
  const [viewState, setViewState] = useState({
    longitude: -0.1275,
    latitude: 51.5072,
    zoom: 9,
    pitch: 50,
    bearing: 0,
    transitionInterpolator: new FlyToInterpolator(),
    transitionDuration: 1100,
  });
  const [city, setCity] = useState("london");
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(2020);
  const [geoData, setGeoData] = useState([]);
  const [populationData, setPopulationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { json, csv } = cities[city].files;
        const [boroughs, populations] = await Promise.all([
          d3.json(json),
          d3.csv(csv),
        ]);

        const combinedData = combineTheData(boroughs, populations, currentYear);
        setPopulationData(populations);
        setGeoData(combinedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [city, currentYear]);

  useEffect(() => {
    const uniqueYears = [...new Set(populationData.map((item) => item.Year))];
    setYears(uniqueYears);
  }, [populationData]);

  const handleCityChange = (city) => {
    setCity(city);
    setCurrentYear(1999);

    setViewState({
      ...viewState,
      longitude: cities[city].longitude,
      latitude: cities[city].latitude,
      zoom: cities[city].zoom || 9,
    });
  };

  const handleYearChange = (e) => {
    setCurrentYear(Number(e.target.value));
  };

  const combineTheData = (geoData, populationData, year) => {
    return geoData.features.map((feature) => {
      const name = feature.properties.name;
      const populationItem = populationData.find(
        (data) => data.Name === name && Number(data.Year) === year
      );
      if (populationItem) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            color: "rgb(55,  100,  0)",
            height: populationItem.Population,
          },
        };
      }
      return feature;
    });
  };

  return (
    <div className="App">
      <CitySelector cities={cities} onCityChange={handleCityChange} />
      <YearSelector
        years={years}
        handleYearChange={handleYearChange}
        currentYear={currentYear}
      />
      <Map location={viewState} data={geoData} />
    </div>
  );
}

export default App;
