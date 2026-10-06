import mongoose from 'mongoose';

if (process.argv.length !== 3 && process.argv.length !== 5) {
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://iwteaaa:${password}@phonebookbackend.hpfo1lj.mongodb.net/phonebook?appName=phonebookBackend`;

mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });
  person.save().then(() => {
    console.log(`Added ${person.name} to the phonebook`);
    mongoose.connection.close();
  });
}
