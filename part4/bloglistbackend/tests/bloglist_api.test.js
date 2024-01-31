const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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

    expect(resultBlog.body).toEqual(blogToView)
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

  test('success with valid data', async () => {
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

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].title).toContain("El oscuro lado de la programación")
    expect(response.body[helper.initialBlogs.length].author).toContain("Armaca")
    expect(response.body[helper.initialBlogs.length].url).toContain("armaca.com.ar")
    expect(response.body[helper.initialBlogs.length].likes).toEqual(121)
  }, 100000)

  test('with likes missing set likes value to 0', async () => {
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

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].title).toContain("El oscuro lado de la programación")
    expect(response.body[helper.initialBlogs.length].author).toContain("Armaca")
    expect(response.body[helper.initialBlogs.length].url).toContain("armaca.com.ar")
    expect(response.body[helper.initialBlogs.length].likes).toEqual(0)
  }, 100000)

  test('with title missing is not added', async () => {
    const newBlog = {
      "author": "Armaca",
      "url": "armaca.com.ar",
      "likes": 121,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = (await api.get('/api/blogs')).body

    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('with url missing is not added', async () => {
    const newBlog = {
      "title": "El oscuro lado de la programación",
      "author": "Armaca",
      "likes": 121,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = (await api.get('/api/blogs')).body

    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 100000)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual("modified title")
    expect(response.body.author).toEqual(blogsAtStart[0].author)
    expect(response.body.url).toEqual(blogsAtStart[0].url)
    expect(response.body.likes).toEqual(blogsAtStart[0].likes)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual("modified title")
    expect(blogsAtEnd[0].author).toEqual(blogsAtStart[0].author)
    expect(blogsAtEnd[0].url).toEqual(blogsAtStart[0].url)
    expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)

  test('changing the author', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "author": "modified author",
    }

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual(blogsAtStart[0].title)
    expect(response.body.author).toEqual("modified author")
    expect(response.body.url).toEqual(blogsAtStart[0].url)
    expect(response.body.likes).toEqual(blogsAtStart[0].likes)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual(blogsAtStart[0].title)
    expect(blogsAtEnd[0].author).toEqual("modified author")
    expect(blogsAtEnd[0].url).toEqual(blogsAtStart[0].url)
    expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)

  test('changing the url', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "url": "modified.url",
    }

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual(blogsAtStart[0].title)
    expect(response.body.author).toEqual(blogsAtStart[0].author)
    expect(response.body.url).toEqual("modified.url")
    expect(response.body.likes).toEqual(blogsAtStart[0].likes)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual(blogsAtStart[0].title)
    expect(blogsAtEnd[0].author).toEqual(blogsAtStart[0].author)
    expect(blogsAtEnd[0].url).toEqual("modified.url")
    expect(blogsAtEnd[0].likes).toEqual(blogsAtStart[0].likes)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)

  test('changing the likes', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const updatedBlog = {
      "likes": 35,
    }

    const response = await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.title).toEqual(blogsAtStart[0].title)
    expect(response.body.author).toEqual(blogsAtStart[0].author)
    expect(response.body.url).toEqual(blogsAtStart[0].url)
    expect(response.body.likes).toEqual(35)
    expect(response.body.id).toEqual(blogsAtStart[0].id)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    expect(blogsAtEnd[0].title).toEqual(blogsAtStart[0].title)
    expect(blogsAtEnd[0].author).toEqual(blogsAtStart[0].author)
    expect(blogsAtEnd[0].url).toEqual(blogsAtStart[0].url)
    expect(blogsAtEnd[0].likes).toEqual(35)
    expect(blogsAtEnd[0].id).toEqual(blogsAtStart[0].id)
  }, 100000)
})

afterAll(async () => {
  await mongoose.connection.close()
})