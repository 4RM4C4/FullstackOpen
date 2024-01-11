var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.lenght === 0 ? 0 : blogs.reduce((sum, current) => sum + current.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((value, current) => current.likes > value.likes ? value = current : value, { likes: 0 })
}

const mostBlogs = (blogs) => {
  const countBlogs = Object.values(_.groupBy(blogs, 'author'))

  const retorno = {
    author : countBlogs[countBlogs.length-1][0].author,
    blogs : countBlogs[countBlogs.length-1].length
  }

  
return retorno
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}