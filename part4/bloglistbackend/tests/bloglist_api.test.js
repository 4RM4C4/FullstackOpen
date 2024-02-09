const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('../utils/config');
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
let app
let api
let mongoServer
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  config.MONGODB_URI = await mongoServer.getUri();
  app = require('../app');
  api = supertest(app);
});

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = await Promise.all(await helper.initialUsers
    .map(async user => {
      user.passwordHash = await bcrypt.hash(user.password, 10)
      return new User(user)
    }))

  const promiseUserArray = await Promise.all(userObjects.map(user => user.save()))

  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  await Promise.all(blogObjects.map(async (blog, position) => {
    blog.author = promiseUserArray[position].id
    const returnedBlog = await blog.save()
    promiseUserArray[position].blogs.concat(returnedBlog.id)
    promiseUserArray[position].save()
    return returnedBlog
  }))

}, 100000)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  }, 100000)
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(resultBlog.body.id).toEqual(blogToView.id)
    expect(resultBlog.body.likes).toEqual(blogToView.likes)
    expect(resultBlog.body.title).toEqual(blogToView.title)
    expect(resultBlog.body.url).toEqual(blogToView.url)
  }, 100000)

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  }, 100000)

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '0303456'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  }, 100000)
})

describe('addition of a new blog', () => {

  test('success with valid data and token', async () => {
    const databaseUsers = await helper.usersInDb()
    const newBlog = {
      "title": "El oscuro lado de la programación",
      "url": "armaca.com.ar",
      "likes": 121,
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    await api
      .post('/api/blogs')
      .set({ Authorization: bearer})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].title).toContain("El oscuro lado de la programación")
    expect(response.body[helper.initialBlogs.length].author.id).toContain(databaseUsers[0].id)
    expect(response.body[helper.initialBlogs.length].url).toContain("armaca.com.ar")
    expect(response.body[helper.initialBlogs.length].likes).toEqual(121)
  }, 100000)

  test('with likes missing set likes value to 0', async () => {
    const databaseUsers = await helper.usersInDb()
    const newBlog = {
      "title": "El oscuro lado de la programación",
      "url": "armaca.com.ar",
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    await api
      .post('/api/blogs')
      .set({ Authorization: bearer})
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].title).toContain("El oscuro lado de la programación")
    expect(response.body[helper.initialBlogs.length].author.id).toContain(databaseUsers[0].id)
    expect(response.body[helper.initialBlogs.length].url).toContain("armaca.com.ar")
    expect(response.body[helper.initialBlogs.length].likes).toEqual(0)
  }, 100000)

  test('with title missing is not added', async () => {
    const newBlog = {
      "url": "armaca.com.ar",
      "likes": 121,
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    await api
      .post('/api/blogs')
      .set({ Authorization: bearer})
      .send(newBlog)
      .expect(400)

    const response = (await api.get('/api/blogs')).body

    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('with url missing is not added', async () => {
    const newBlog = {
      "title": "El oscuro lado de la programación",
      "likes": 121,
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    await api
      .post('/api/blogs')
      .set({ Authorization: bearer})
      .send(newBlog)
      .expect(400)

    const response = (await api.get('/api/blogs')).body

    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('fails without Bearer token', async () => {
    const databaseUsers = await helper.usersInDb()
    const newBlog = {
      "title": "El oscuro lado de la programación",
      "url": "armaca.com.ar",
      "likes": 121,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: bearer})
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.id)

    expect(contents).not.toContain(blogToDelete.id)
  }, 100000)
})

describe('updating of a blog', () => {
  test('changing the title', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "title": "modified title",
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .set({ Authorization: bearer})
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    
    expect(response.body.title).toEqual("modified title")
    expect(response.body.author).toEqual(blogsAtStart[0].author.toString())
    expect(response.body.url).toEqual(blogsAtStart[0].url)
    expect(response.body.likes).toEqual(blogsAtStart[0].likes)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual("modified title")
    expect(blogsAtEnd[0].author.toString()).toEqual(blogsAtStart[0].author.toString())
    expect(blogsAtEnd[0].url).toEqual(blogsAtStart[0].url)
    expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)

  test('changing the url', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "url": "modified.url",
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .set({ Authorization: bearer})
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual(blogsAtStart[0].title)
    expect(response.body.author).toEqual(blogsAtStart[0].author.toString())
    expect(response.body.url).toEqual("modified.url")
    expect(response.body.likes).toEqual(blogsAtStart[0].likes)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual(blogsAtStart[0].title)
    expect(blogsAtEnd[0].author.toString()).toEqual(blogsAtStart[0].author.toString())
    expect(blogsAtEnd[0].url).toEqual("modified.url")
    expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)

  test('changing the likes', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "likes": 35,
    }

    const login = {
      "username": helper.initialUsers[0].username,
      "password": helper.initialUsers[0].password
    }

    const bearer = 'Bearer '.concat((await api.post('/api/login').send(login)).body.token)

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .set({ Authorization: bearer})
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual(blogsAtStart[0].title)
    expect(response.body.author).toEqual(blogsAtStart[0].author.toString())
    expect(response.body.url).toEqual(blogsAtStart[0].url)
    expect(response.body.likes).toEqual(35)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual(blogsAtStart[0].title)
    expect(blogsAtEnd[0].author.toString()).toEqual(blogsAtStart[0].author.toString())
    expect(blogsAtEnd[0].url).toEqual(blogsAtStart[0].url)
    expect(blogsAtEnd[0].likes).toEqual(35)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)
})

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'Armaca',
      name: 'Ariel',
      password: 'hackeable',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with a username length < 3', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'Ar',
      name: 'Ariel',
      password: 'hackeable',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with a password length < 3', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: '4RM4C4',
      name: 'Ariel',
      password: 'ha',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
})

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await mongoose.connection.close()
});