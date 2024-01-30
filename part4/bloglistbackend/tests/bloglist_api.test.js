const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "Tengo un titulo muy malo",
    "author": "Bigote Lactico",
    "url": "midireccion.com",
    "likes": 69,
    "id": "659eed6260b672aa2cd2ea54"
  },
  {
    "title": "Otro Titulo Malardo",
    "author": "Bijeator",
    "url": "midireccionbijeada.com",
    "likes": 69,
    "id": "659ef0c0792a7626259440ef"
  },
  {
    "title": "El Blanco lado de la luna",
    "author": "Blanco Shinso",
    "url": "Shinso.blanco.com",
    "likes": 69,
    "id": "659f0074291dae16f691c71d"
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

test('blogslist are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('post successfully creates a new blog', async () => {
  const newBlog = {
    "title": "El oscuro lado de la programación",
    "author": "Armaca",
    "url": "armaca.com.ar",
    "likes": 121,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'El oscuro lado de la programación'
  )
})

test('post with likes missing set likes value to 0', async () => {
  const newBlog = {
    "title": "El oscuro lado de la programación",
    "author": "Armaca",
    "url": "armaca.com.ar",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likes = response.body.map(r => r.likes)

  expect(likes[initialBlogs.length]).toEqual(0)
})

afterAll(async () => {
  await mongoose.connection.close()
})