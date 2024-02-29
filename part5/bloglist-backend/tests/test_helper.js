const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    "username": "Bigote",
    "name": "Bigote Lactico",
    "password": "la1password",
  },
  {
    "username": "Bijeator",
    "name": "Bijeator Intergalactico",
    "password": "la2password",
  },
  {
    "username": "Shinso90",
    "name": "Blanco Shinso",
    "password": "la3password",
  }
]

const nonExistingId = async () => {
  const databaseUsers = await usersInDb()
  
  const blog = new Blog({
    "title": 'willremovethissoon',
    "author": databaseUsers[0].id,
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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}