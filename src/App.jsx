import { useState } from "react";
import "./App.css";
import CurrentWeather from "./components/current-weather/CurrentWeather";
import Search from "./components/search/Search";
import { WEATHER_API } from "./utils/Api";
import Forecast from "./components/forecast/Forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API}/weather?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API}/forecast?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };

  // console.log(currentWeather);
  // console.log(forecast);

  return (
    <div className="App">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast forecastData={forecast} />}
    </div>
  );
}

export default App;
