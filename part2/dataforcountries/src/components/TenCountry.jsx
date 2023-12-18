import React from 'react'

const TenCountry = ({country, action}) => <tr><td key={country.name.common}>{country.name.common}</td><td><button type="button" onClick={() => action(country.name.common)}>Show</button></td></tr>

export default TenCountry