const AddNote = ({ addNote, newNote, handleNoteChange, user }) => {
  if (user !== null) {
    return (<form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>)
  }
  return <></>
}
export default AddNote