export const AddNewPersonBlock = ({ addHandler, newName, newNumber, setNewName, setNewNumber }) => {

    return (
        <>
            <h2>add a new</h2>
            <div>
                name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
                number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
            </div>
            <div>
                <button onClick={addHandler} type="submit">add</button>
            </div>
        </>
    )
}