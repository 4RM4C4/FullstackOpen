const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
return blogs.lenght === 0 ? 0 : blogs.reduce((sum, current) => sum+current.likes,0)
} 


module.exports = {
  dummy,
  totalLikes
}