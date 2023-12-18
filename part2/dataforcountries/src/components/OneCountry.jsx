import React from 'react'

const OneCountry = ({country}) =>  {
    const countryLanguages = country.languages
    const flag = country.flags.svg
    const languages = []
    for (const property in countryLanguages) {
      languages.push(countryLanguages[property])
    }


return <>
<h1>{country.name.common}</h1>
<p>Capital: {country.capital}</p>
<p>Population: {country.population}</p>
<h2>Languages:</h2>
    <ul>
        {languages.map((map) => <li key={map}>{map}</li>)}
    </ul>
    <img src={flag} height={100}></img>
</>
}

export default OneCountry