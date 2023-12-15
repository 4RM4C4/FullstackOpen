import React from 'react'

const Countries = ({countries, filter}) => {
    let filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    if(filteredCountries.filter((country) => country.name.common.length === filter.length).length == 1){
        filteredCountries = filteredCountries.filter((country) => country.name.common.length === filter.length)
    }

    if (filter === '') {
        return countries.map((country, position) => <p key={position}>{country.name.common}</p>)
    } 
    if (filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter.</p>
    } else if (filteredCountries.length != 1) {
        return filteredCountries.map((country, position) => <p key={position}>{country.name.common}</p>)
    } else {
        const countryLanguages = filteredCountries[0].languages
        const flag = filteredCountries[0].flags.svg
        const languages = []
        for (const property in countryLanguages) {
          languages.push(countryLanguages[property])
        }
        return (
            <>
            <h1>{filteredCountries[0].name.common}</h1>
            <p>Capital: {filteredCountries[0].capital}</p>
            <p>Population: {filteredCountries[0].population}</p>
            <h2>Languages:</h2>
                <ul>
                    {languages.map((map, index) => <li key={index}>{map}</li>)}
                </ul>
                <img src={flag} height={100}></img>
            </>
            )
    }
}

export default Countries