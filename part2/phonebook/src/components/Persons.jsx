import React from 'react'

const Persons = ({persons, filter}) => filter === '' ? persons.map((person, position) => <p key={position}>{person.name} {person.number}</p>) : persons.map((person, position) => (person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter) ? <p key={position}>{person.name} {person.number}</p> : ''))

export default Persons