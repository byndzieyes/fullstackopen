import { useState } from 'react';

const FilterInput = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <h2>Filter</h2>
      <p>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </p>
    </div>
  );
};

const PersonForm = ({ addName, newName, handleNameChange, newPhone, handlePhoneChange }) => {
  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={addName}>
        <p>
          name: <input value={newName} onChange={handleNameChange} />
        </p>
        <p>
          number: <input value={newPhone} onChange={handlePhoneChange} />
        </p>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

const DisplayPersons = ({ persons, filter }) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const nameObject = {
      name: newName,
      number: newPhone,
      id: persons.length + 1,
    };
    setPersons(persons.concat(nameObject));
    setNewName('');
    setNewPhone('');
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <FilterInput filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <DisplayPersons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
