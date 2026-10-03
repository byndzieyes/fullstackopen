import { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './components/Notification';

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

const DisplayPersons = ({ persons, filter, handleDelete }) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

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

    const personToUpdate = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

    if (personToUpdate) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {
          ...personToUpdate,
          number: newPhone,
        };

        axios.put(`http://localhost:3001/persons/${personToUpdate.id}`, updatedPerson).then((response) => {
          setPersons(persons.map((person) => (person.id === personToUpdate.id ? response.data : person)));

          setNewName('');
          setNewPhone('');
          setNotification({
            message: `Updated ${newName}`,
            type: 'success',
          });

          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
      }

      return;
    }

    const nameObject = {
      name: newName,
      number: newPhone,
    };

    axios.post('http://localhost:3001/persons', nameObject).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName('');
      setNewPhone('');
      setNotification({
        message: `Added ${newName}`,
        type: 'success',
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setNotification({
            message: `Deleted ${personToDelete.name}`,
            type: 'success',
          });

          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setNotification({
            message: `Information of ${personToDelete.name} has already been removed from server`,
            type: 'error',
          });

          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <FilterInput filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <DisplayPersons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
