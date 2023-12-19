import React from 'react'
import Country from './Country'
import TenCountry from './TenCountry'
import OneCountry from './OneCountry'

const Countries = ({countries, filter, action, api_key, weather, setWeather}) => {
    let filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    if(filteredCountries.filter((country) => country.name.common.length === filter.length).length == 1){
        filteredCountries = filteredCountries.filter((country) => country.name.common.length === filter.length)
    }

    if (filter === '') {
        return <ul>{countries.map((country) => <Country key={country.name.common} country={country}/>)}</ul>
    } 
    if (filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter.</p>
    } else if (filteredCountries.length != 1) {
        return <table><tbody>{filteredCountries.map((country) => <TenCountry key={country.name.common} country={country} action={action}/>)}</tbody></table>
    } else {
        return <>{filteredCountries.map((country) => <OneCountry key={country.name.common} country={country} api_key={api_key} weather={weather} setWeather={setWeather}/>)}</>
    }
}

export default Countries