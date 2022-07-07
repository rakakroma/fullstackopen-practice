import { useEffect, useState } from 'react'
import { PhoneBookList } from './components/PhoneBookList'
import { AddNewPersonBlock } from './components/AddNewPersonBlock'
import { FilterBlock } from './components/FilterBlock'
import contactsAPI from './services/contacts'


const Notification = ({ message, setMessage }) => {


  useEffect(() => {
    setTimeout(() => {
      setMessage('')
    }, 2000)
  }, [message])

  const getStyle = {
    backgroundColor: "lightgreen",
    border: "2px solid black"
  }

  const createStyle = {
    backgroundColor: "lightyellow",
    border: "2px solid black"
  }

  const updateStyle = {
    backgroundColor: "lightblue",
    border: "2px solid black"
  }

  const deleteStyle = {
    backgroundColor: "gainsboro",
    border: "2px solid black"
  }

  const errorStyle = {
    backgroundColor: 'hotpink',
    border: "2px solid black"
  }


  if (!message) {
    return null
  }
  else if (message[0] === "GET") {
    return <div style={getStyle}>
      Get data from server
    </div>
  } else if (message[0] === "CREATE") {
    return <div style={createStyle}>
      {message[1]} has been created
    </div>
  } else if (message[0] === 'UPDATE') {
    return <div style={updateStyle}>
      {message[1]} has been updated
    </div>
  } else if (message[0] === 'DELETE') {
    return <div style={deleteStyle}>
      {message[1]} has been deleted
    </div>
  } else if (message[0] === 'ERROR') {
    return <div style={errorStyle}>
      ERROR: {message[1]}
    </div>
  }
}


const App = () => {

  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: "040-123456", id: 1 },
    // { name: 'Ada Lovelace', number: "39-44-5323523", id: 2 },
    // { name: 'Dan Abramov', number: "12-43-234345", id: 3 },
    // { name: "Mary Poppendieck", number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    console.log('effect')
    contactsAPI.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data);
        setMessage(["GET", ""]);
        console.log('i did it');
      })

      .catch(error => {
        console.log(error);
        setMessage(["ERROR", 'cannot connect to the server, please refresh'])
      })
  }, [])


  const addHandler = (e) => {
    e.preventDefault();
    const newObject = {
      name: newName,
      number: newNumber,
    }


    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        const updateItemIndex = persons.findIndex(person => person.name === newName)
        console.log(persons[updateItemIndex])
        contactsAPI.update(persons[updateItemIndex].id, newObject)
          .then(response => {
            console.log(response);
            setPersons(persons.map((person) => person.name === newName ? { ...person, number: newNumber } : person));
            setMessage(["UPDATE", newName]);
            setNewName('')
            setNewNumber('')
            console.log('i did it')
          })
          .catch(error => {
            console.log(error);
            setMessage(['ERROR', `can't update this contact info to server`])
          })

      }
    } else if (persons.find(person => person.number === newNumber)) {
      alert(`${newNumber} is already add to phonebook`)
    } else if (!newName) {
      alert("Please fill the input")
    } else {
      contactsAPI.create(newObject)
        .then(response => {
          console.log(response)
          setPersons([...persons, { name: newName, number: newNumber, id: persons[persons.length - 1].id + 1 }]);
          setMessage(["CREATE", newName])
          setNewName("")
          setNewNumber("")
          console.log('i did it')
        })
        .catch(error => {
          console.log(error);
          setMessage(['ERROR', `can't create this contact info`])
        })




    }
  }

  const filterHandler = (e) => {
    setFilterInput(e.target.value);
  }

  const handleDelete = (e) => {
    if (window.confirm(`Are you sure you want to delete ${e.target.parentNode.id}'s contact info?`)) {
      contactsAPI.deleteItem(e.target.id)
        .then(response => {
          console.log(response)
          setPersons(persons.filter(person => person.id !== parseInt(e.target.id)))
          setMessage(["DELETE", e.target.parentNode.id])
          console.log('i did it')

        })
        .catch(error => {
          console.log(error);
          console.log('got error')
          if (error.response.status === 404) {
            setMessage(['ERROR', `${e.target.parentNode.id} has already been deleted`]);
            setPersons(persons.filter(person => person.id !== parseInt(e.target.id)));
          } else {
            setMessage(['ERROR', `can't delete this contact info`]);
          }
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} setMessage={setMessage} />
      <form>
        <FilterBlock filterHandler={filterHandler} filterInput={filterInput} />
        <AddNewPersonBlock addHandler={addHandler} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      </form>
      <h2>Numbers</h2>
      <PhoneBookList persons={persons} filterInput={filterInput} handleDelete={handleDelete} />
    </div>
  )
}

export default App


