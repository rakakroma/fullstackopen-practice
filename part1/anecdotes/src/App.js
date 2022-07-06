import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const [selected, setSelected] = useState(0)

  const maxVote = Math.max(...votes)
  const maxVoteAnecDotes = anecdotes[votes.findIndex(vote => vote === maxVote)]
  return (
    <>
      <div>
        {anecdotes[selected]}
      </div>
      <div>has {votes[selected]} votes</div>
      <VoteButton votes={votes} setVotes={setVotes} selected={selected} />
      <NextButton setSelected={setSelected} length={anecdotes.length} />
      <h1>Anecdotes with most votes</h1>
      <div>{maxVoteAnecDotes}</div>
      <div>has {maxVote} votes</div>
    </>
  )
}

export default App

const NextButton = ({ setSelected, length }) => {
  const nextHandler = () => {
    setSelected(Math.floor(Math.random() * length))
  }

  return <button onClick={nextHandler}>next anecdotes</button>
}

const VoteButton = ({ votes, selected, setVotes }) => {
  const updateVotes = [...votes]
  updateVotes[selected] += 1

  const voteHandler = () => {
    setVotes(updateVotes)
  }

  return <button onClick={voteHandler}>vote</button>
}