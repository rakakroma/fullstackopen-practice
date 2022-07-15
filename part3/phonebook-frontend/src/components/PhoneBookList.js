
export const PhoneBookList = ({ persons, filterInput, handleDelete }) => {

    if (filterInput) {

        const shownList = persons.filter(person => {
            if (person.name.toLowerCase().includes(filterInput.toLowerCase())) {
                return person
            }
        })
        return (
            <ol>
                {shownList.map(person => {
                    return <li key={person.name}>
                        {person.name} {person.number}
                        <button id={person.id} onClick={handleDelete}>delete</button>
                    </li>
                })}

            </ol>
        )
    }
    return (
        <ol>
            {persons.map(person => {
                return <li key={person.name} id={person.name}>
                    {person.name} {person.number}
                    <button id={person.id} onClick={handleDelete}>delete</button>
                </li>
            })}
        </ol>
    )
}