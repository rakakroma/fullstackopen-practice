import axios from "axios";
import { useEffect, useState } from "react";


const CountryInfo = ({ country }) => {

  return <>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital[0]}</p>
    <p>area {country.area}</p>
    <div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
    </div>
    <img src={country.flags.png} alt={"flag of " + country.name.common} ></img>
    <WeatherInfo country={country} />
  </>
}

const WeatherInfo = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY
  const [weatherData, setWeatherData] = useState()

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.cca3}&appid=${api_key}&units=metric`)
      .then(response => setWeatherData(response.data))
  }, [country])

  if (weatherData) {
    return <div>
      <h2>Wearther in {country.capital}</h2>
      <p>temperature {weatherData.main.temp} Celcius</p>
      <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={'Picture of ' + weatherData.weather[0].description}></img>
      <p>wind {weatherData.wind.speed} m/s</p>
    </div>
  } else {
    return <div>no weather data</div>
  }
}

const SearchResult = ({ countries, searchInput, setSearchInput }) => {

  const handleShow = (e) => {
    setSearchInput(e.target.parentNode.id)
  }


  if (!searchInput) {
    return
  } else if (countries) {
    const searchResultData = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchInput.toLowerCase()))
    if (searchResultData.length > 10) {
      return (<p>
        Too many matches, specify another filter
      </p>)
    } else if (searchResultData.length === 1) {
      return <CountryInfo country={searchResultData[0]} />
    }
    const resultCountriesNameList = searchResultData.map(country =>
      <li key={country.cca3} id={country.name.common}>
        {country.name.common} <button onClick={handleShow}>show</button>
      </li>)
    return <ol>{resultCountriesNameList}</ol>

  } else {
    return <div>no data</div>
  }
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [countries, setCountries] = useState()


  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all#')
      .then(response => {
        setCountries(response.data);
      })
  }, [])


  return (
    <div className="App">
      <div>find countries
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <p>{searchInput}</p>
        <SearchResult countries={countries} searchInput={searchInput} setSearchInput={setSearchInput} />
      </div>
    </div>
  );
}

export default App;
