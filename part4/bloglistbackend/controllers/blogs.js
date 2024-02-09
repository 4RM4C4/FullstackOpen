const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author', { username: 1, name: 1, id: 1})
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/',middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user)
  const blog = new Blog({
    title: body.title,
    url: body.url,
    likes: body.likes,
    author: user.id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user)
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if ( blog.author.toString() !== user.id.toString() ) {
    return response.status(401).json({ error: 'only the owner of the blog can delete it' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter