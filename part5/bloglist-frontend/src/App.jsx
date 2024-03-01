import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import AddBlog from './components/AddBlog'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({title : '',
url: ''})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog(prevState=> ({
      ...prevState,
      [name]: value
    }));
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      const ErrorMessageObject = {
        message: `Wrong Username or Password.`,
        status: "nok",
      }
      setErrorMessage(ErrorMessageObject)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (event) => {
    event.preventDefault()
    blogService
      .create(newBlog)
      .then(() => {
        blogService.getAll().then(blogs =>
          setBlogs(blogs)
        )
        const ErrorMessageObject = {
          message: `A new Blog ${newBlog.title} by ${user.name} added`,
          status: "ok",
        }
        setNewBlog({title : '',
        url: ''})
        setErrorMessage(ErrorMessageObject)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification ErrorMessage={errorMessage}/>
        <Login username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} user={user} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification ErrorMessage={errorMessage} />
      <p style={{display : 'inline-block'}}>{user.name} logged in</p>
      <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedBloglistappUser')}}>Log out</button>
      <AddBlog addBlog={addBlog} newBlog={newBlog} handleBlogChange={handleBlogChange} user={user}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App