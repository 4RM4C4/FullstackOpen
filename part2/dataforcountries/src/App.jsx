import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'

const api_key = process.env.REACT_APP_API_KEY

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  


  return (
    <div>
      <h2>Data for countries</h2>
      <h3>Find a country</h3>
      <Filter value={filter} action={handleFilterChange}/>
      <h3>Countries</h3>
      <Countries countries={countries} filter={filter} action={setFilter} api_key={api_key} weather={weather} setWeather={setWeather}/>
    </div>
  )
}

export default App
