const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  url: { type: String, required: true},
  likes: { type: Number, default: '0'}
},
  {
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        returnedObject.author = returnedObject.author.toString()
      },
    },
  })

module.exports = mongoose.model('Blog', blogSchema)