const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
    console.log(JSON.stringify(error))
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'MongooseError') {
        return response.status(500).send({ error: 'could not connect to db' })
    }

    if (error.name === 'NameMissing') {
        return response.status(400).send({ error: 'name missing' })
    }

    if (error.name === 'NumberMissing') {
        return response.status(400).send({ error: 'number missing' })
    }

    if (error.name === 'NameNotUnique') {
        return response.status(400).send({ error: 'name must be unique' })
    }

    next(error)
}

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${Date()}</p>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return next(error = { name: 'NameMissing' })
    }

    if (!body.number) {
        return next(error = { name: 'NumberMissing' })
    }

    Person.findOne({ name: body.name })
        .then(result => {
            if (result) {
                next(error = { name: 'NameNotUnique' })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })

                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => next(error))
            }
        })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})  