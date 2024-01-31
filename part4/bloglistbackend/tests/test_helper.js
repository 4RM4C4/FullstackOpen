const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "Tengo un titulo muy malo",
    "author": "Bigote Lactico",
    "url": "midireccion.com",
    "likes": 69
  },
  {
    "title": "Otro Titulo Malardo",
    "author": "Bijeator",
    "url": "midireccionbijeada.com",
    "likes": 69
  },
  {
    "title": "El Blanco lado de la luna",
    "author": "Blanco Shinso",
    "url": "Shinso.blanco.com",
    "likes": 69
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    "title": 'willremovethissoon',
    "author": "Random Author",
    "url": "random-url.com",
    "likes": 3,
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}