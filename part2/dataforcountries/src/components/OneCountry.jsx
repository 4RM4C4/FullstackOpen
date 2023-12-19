import React, { useEffect } from 'react'
import Weather from './Weather'
import axios from 'axios'

const OneCountry = ({ country, api_key, weather, setWeather }) => {
    const countryLanguages = country.languages
    const flag = country.flags.svg
    const languages = []
    for (const property in countryLanguages) {
        languages.push(countryLanguages[property])
    }

    useEffect(() => {
        const params = {
            q: country.capital + ',' + country.cca2,
            limit: 3,
            appid: api_key,
        }
        axios
            .get('http://api.openweathermap.org/data/2.5/weather', { params })
            .then(response => {
                setWeather(response.data)
            })
    }, [])


    return <>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital.map((value, position) => {
            if(position == (country.capital.length)-1) {
                return value+"."
            }
            return value+", " })}</p>
        <p>Population: {country.population}</p>
        <h2>Languages:</h2>
        <ul>
            {languages.map((map) => <li key={map}>{map}</li>)}
        </ul>
        <img src={flag} height={100}></img>
        <Weather country={country} weather={weather} setWeather={setWeather} />
    </>
}

export default OneCountry