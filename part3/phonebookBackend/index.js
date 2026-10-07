import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/person.js';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  phonebook = phonebook.filter((person) => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
