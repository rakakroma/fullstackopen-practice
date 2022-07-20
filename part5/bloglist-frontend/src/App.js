import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateForm from './components/CreateForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 4500)
    }

    setUsername('')
    setPassword('')
  }

  const handleLogout = (e) => {
    e.preventDefault()
    setUser('')
    blogService.setToken('')
  }

  const blogFormRef = useRef()

  const updateBlog = async (newBlog) => {
    try {
      await blogService.update(newBlog.id, newBlog)
      const blogIndexForReplace = blogs.findIndex(blog => blog.id === newBlog.id)
      const newBlogsArray = [...blogs]
      newBlogsArray[blogIndexForReplace].likes += 1
      setBlogs(blogs)
      setMessage(`you've just liked a blog ${newBlog.title} by ${newBlog.author}!`)
      setTimeout(() => {
        setMessage(null)
      }, 4500)
    } catch (exception) {
      setMessage('the like click was failed, please check your internet connection')
      setTimeout(() => {
        setMessage(null)
      }, 4500)
    }
  }

  const deleteBlog = async (blogToDelete) => {
    const confirm = window.confirm(`delete ${blogToDelete.title}?`)
    if (confirm) {
      try {
        const response = await blogService.deleteOne(blogToDelete.id)
        console.log(blogToDelete.id)
        console.log(response)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        setMessage('you\'ve remove a blog!')
        setTimeout(() => {
          setMessage(null)
        }, 4500)
      } catch (exception) {
        console.log(exception)
        setMessage('the deletion was failed, please check your internet connection')
        setTimeout(() => {
          setMessage(null)
        }, 4500)
      }
    }
  }
  const createNewBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setMessage(`you've just add a blog ${newBlog.title} by ${newBlog.author}!`)
      setTimeout(() => {
        setMessage(null)
      }, 4500)

      console.log(response)

    } catch (exception) {
      setMessage('the blog post was failed, please check your internet')
      setTimeout(() => {
        setMessage(null)
      }, 4500)
    }
  }

  const sortedBlog = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      {message ?
        <div style={{ backgroundColor: 'lightpink' }}>{message}</div> :
        null
      }

      {user ?
        <>
          <h2>Blogs</h2>
          <h4>{user.name} logged in</h4>
          <button onClick={handleLogout}>log out</button>
          <div>{sortedBlog.map(blog => {
            return (
              <Blog key={blog.id} blog={blog} updateBlog={updateBlog} handleDelete={() => deleteBlog(blog)} user={user} />
            )
          }
          )}</div>
          <Togglable buttonLabel="new note" ref={blogFormRef}>
            <CreateForm createNewBlog={createNewBlog} />
          </Togglable>
        </> : <>
          <h2>log in to the application</h2>
          <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </>
      }

    </div>
  )
}

export default App

