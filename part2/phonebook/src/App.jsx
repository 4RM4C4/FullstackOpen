import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
    if(persons.some(p => p.name === personObject.name)){
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
    setFilter('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div> Filter shown with: <input value={filter} onChange={handleFilterChange} /> </div>
      <h2>Add a new</h2>
      <form onSubmit={addName}>
        <div> name: <input value={newName} onChange={handleNameChange} /> </div>
        <div> number: <input value={newNumber} onChange={handleNumberChange} /> </div>
        <div> <button type="submit">add</button> </div>
      </form>
      <h2>Numbers</h2>
      {filter === '' ? persons.map((person, position) => <p key={position}>{person.name} {person.number}</p>) : persons.map((person, position) => (person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter) ? <p key={position}>{person.name} {person.number}</p> : ''))}
    </div>
  )
}

export default App
