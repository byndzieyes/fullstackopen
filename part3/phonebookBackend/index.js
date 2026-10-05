import express from 'express';
import morgan from 'morgan';

const PORT = process.env.PORT || 3001;

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
  res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }
  if (phonebook.some((person) => person.name === name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }
  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name,
    number,
  };
  phonebook = [...phonebook, newPerson];
  res.status(201).json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  phonebook = phonebook.filter((person) => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
