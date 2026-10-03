import { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const SearchInput = ({ search, handleSearch }) => (
  <label>
    Search for a country: <input value={search} onChange={handleSearch} />
  </label>
);

const DisplayCountry = ({ country }) => (
  <div>
    <h2>{country.name}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area} km²</p>
    <h3>Languages</h3>
    <ul>
      {country.languages.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flag} alt={`Flag of ${country.name}`} width="200" />
  </div>
);

const Weather = ({ capital, capitalCoordinates }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: capitalCoordinates[0],
          lon: capitalCoordinates[1],
          appid: apiKey,
          units: 'metric',
        },
      })
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, [capitalCoordinates]);

  if (!weather) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp}°C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

const DisplayCountries = ({ countries, search, handleShowCountry }) => {
  if (search.trim() === '') {
    return <p>Please enter a search term to find countries.</p>;
  }
  const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()));

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another search.</p>;
  }

  if (filteredCountries.length > 1) {
    return filteredCountries.map((country) => (
      <p key={country.name}>
        {country.name}
        <button onClick={() => handleShowCountry(country.name)}>Show</button>
      </p>
    ));
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];

    return (
      <div>
        <DisplayCountry country={country} />
        {country.capitalCoordinates ? (
          <Weather capital={country.capital} capitalCoordinates={country.capitalCoordinates} />
        ) : (
          <p>Weather data unavailable.</p>
        )}
      </div>
    );
  }

  return <p>No countries found.</p>;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      const countriesData = response.data.map((country) => ({
        name: country.name.common,
        capital: country.capital ? country.capital[0] : 'N/A',
        capitalCoordinates: country.capitalInfo?.latlng ?? null,
        area: country.area,
        languages: country.languages ? Object.values(country.languages) : [],
        flag: country.flags.png,
      }));
      setCountries(countriesData);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleShowCountry = (countryName) => {
    setSearch(countryName);
  };

  return (
    <div>
      <h1>Countries</h1>
      <SearchInput search={search} handleSearch={handleSearch} />
      <DisplayCountries countries={countries} search={search} handleShowCountry={handleShowCountry} />
    </div>
  );
}

export default App;
