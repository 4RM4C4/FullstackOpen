import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(p => p.name === personObject.name)) {
      if(persons.some(p => p.number === personObject.number)){
        alert(`${newName} with number ${newNumber} is already added to phonebook.`)
        setNewName('')
        setNewNumber('')
        setFilter('')
      } else {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
          const personId = persons.filter(p => p.name == personObject.name)[0].id
          personsService
            .update(personId, personObject)
            .then(response => {
              setPersons(persons.map(person => person.id !== response.id ? person : response))
              setNewName('')
              setNewNumber('')
              setFilter('')
            })
        }
      }
    } else {
      personsService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setFilter('')
        })
    }
  }

  const deleteName = (personToDelete) => {
    if(window.confirm(`Delete ${personToDelete.name}?`)){
      personsService
      .borrar(personToDelete.id)
      .then(
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} action={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm formAction={addName} name={newName} nameChange={handleNameChange} number={newNumber} numberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <table>
        <tbody>
          <Persons persons={persons} filter={filter} action={deleteName} />
        </tbody>
      </table>
    </div>
  )
}

export default App
