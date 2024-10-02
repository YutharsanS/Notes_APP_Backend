const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('content', (request, response) => {
    const body = request.body
    return JSON.stringify(body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


const PORT = 3001

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 10000)

app.get('/', (request, response) => {
    response.send("<h1>Persons</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json(
            {
                error: "Name is required"
            }
        )
    } else if (!body.number) {
        return response.status(400).json(
            {
                error: "Number is required"
            }
        )
    }

    if (persons.map((person) => person.name).findIndex((name) => name === body.name) !== -1) {
        return response.status(400).json(
            {
                error: "Name must be unique"
            }
        )
    }

    const id = generateId()
    const new_entry = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(new_entry)
    response.json(new_entry)
})

app.get('/info', (request, response) => {
    const dateTime = new Date();
    const result =
    `
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${dateTime.toString()}</p>
    `
    response.send(result)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id != id)
    response.send(`Note with id ${id} is deleted from the server`)
})

app.listen(PORT, () => {
    console.log(`Server runs on ${PORT}`)
})