import { useState } from 'react'

const CreateForm = ({ createNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    createNewBlog({
      title, author, url, likes: 0
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return <div>
    <h2>create new</h2>
    <form onSubmit={handleCreate}>
      <label htmlFor="title">title</label>
      <input type="text" value={title} name="title" id="title" placeholder='blog title' onChange={e => setTitle(e.target.value)} />
      <br />
      <label htmlFor="author">author</label>
      <input type="text" value={author} name="author" id="author" placeholder='blog author' onChange={e => setAuthor(e.target.value)} />
      <br />
      <label htmlFor="url">url</label>
      <input type="text" value={url} name="url" id="url" placeholder='blog url' onChange={e => setUrl(e.target.value)} />
      <br />
      <button type="submit">post blog</button>
    </form>
  </div>
}

export default CreateForm
