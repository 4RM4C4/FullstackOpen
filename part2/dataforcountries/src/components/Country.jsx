import React from 'react'

const Country = ({country}) => <p key={country.name.common}>{country.name.common}</p>

export default Country