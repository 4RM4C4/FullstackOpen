const morgan = require('morgan')
const express = require('express')
require('dotenv').config()

const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
    return
  }
  if (error.name === 'MongooseError') {
    response.status(500).send({ error: 'could not connect to db' })
    return
  }
  if (error.name === 'NameMissing') {
    response.status(400).send({ error: 'name missing' })
    return
  }
  if (error.name === 'NumberMissing') {
    response.status(400).send({ error: 'number missing' })
    return
  }
  if (error.name === 'NameNotUnique') {
    response.status(400).send({ error: 'name must be unique' })
    return
  }
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
    return
  }
  next(error)
}

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${Date()}</p>`)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request

  Person.findOne({ name: body.name })
    .then((result) => {
      if (result) {
        const error = { name: 'NameNotUnique' }
        next(error)
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person.save()
          .then((savedPerson) => {
            response.json(savedPerson)
          })
          .catch((error) => next(error))
      }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request
  Person.findByIdAndUpdate(request.params.id, { number: body.number }, { returnDocument: 'after', runValidators: true })
    .then((result) => {
      response.status(200).send(result)
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
