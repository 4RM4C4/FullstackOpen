import React from 'react'

const Persons = ({ persons, filter, action }) => (filter === '' ? persons.map((person) => (
  <tr key={person.name}>
    <td>{person.name}</td>
    <td>{person.number}</td>
    <td><button type="button" onClick={() => action(person)}>Delete</button></td>
  </tr>
)) : persons.map((person) => (
  person.name.toLowerCase()
    .includes(filter.toLowerCase()) || person.number.includes(filter)
    ? (
      <tr key={person.name}>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button type="button" onClick={() => action(person)}>Delete</button></td>
      </tr>
    ) : '')))
export default Persons
