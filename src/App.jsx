import Note from '../components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('Enter a new note...')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    console.log('In effect')

    axios.get('http://localhost:3001/notes')
        .then(response => {
          console.log('Notes retrieved.')
          setNotes(response.data)
        })
        .catch(error =>{
          console.log(error)
        })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    
    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5
    }

    axios.post('http://localhost:3001/notes', noteObj)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
    
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

const notesToShow = showAll 
  ? notes
  : notes.filter(note => note.important)


const toggleImportance = (id) => {
  console.log('toggle importance of id:', id)
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(note => note.id === id)
  const changedNote = {...note, important: !note.important}

  axios.put(url, changedNote)
    .then(response => {
      setNotes(notes.map(note => note.id !== id ? 
        note : response.data))
    })
}
  return(
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note =>
          <Note 
          key={note.id} 
          note={note}
          toggleImportance={() => toggleImportance(note.id)}/>)}  
      </ul>
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all'}
      </button>
      <h1>Add a note</h1>
      <form onSubmit={addNote}>
        <input 
          value ={newNote}
          onChange={handleNoteChange}/>
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default App
