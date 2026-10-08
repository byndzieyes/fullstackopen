import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/person.js';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  return Person.countDocuments({}).then((count) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
  });
});

app.get('/api/persons', (req, res) => {
  return Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  return Person.findById(req.params.id).then((person) => {
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

  return person.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;

  return Person.findById(req.params.id).then((person) => {
    if (!person) {
      return res.status(404).end();
    }

    person.name = name;
    person.number = number;

    return person.save().then((updatedPerson) => {
      res.json(updatedPerson);
    });
  });
});

app.delete('/api/persons/:id', (req, res) => {
  return Person.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end();
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(err);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
