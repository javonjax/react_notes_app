import Note from '../components/Note'
import Notification from '../components/Notification'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('Enter a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    console.log('Effect rendered')
    noteService.getAll()
        .then(initialNotes => {
          setNotes(initialNotes)
        })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    
    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService.create(noteObj)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
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
  const note = notes.find(note => note.id === id)
  const changedNote = {...note, important: !note.important}

  noteService.update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ?
        note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note ${note.id} has already been removed from the server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(note => note.id !== id))
    })
      
}
  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
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
      <Footer/>
    </div>
  )
}

export default App
