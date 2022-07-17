
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
// const logger = require('./utils/logger')

const server = http.createServer(app)

// server.listen(config.PORT, () => {
//     logger.info(`Server running on port ${config.PORT}`)
// })

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})

// const http = require('http')
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongoose = require('mongoose')
// require("dotenv").config();
// const blogsRouter = require('./controllers/blogs')






// const blogSchema = new mongoose.Schema({
//     title: String,
//     author: String,
//     url: String,
//     likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = 'mongodb://localhost/bloglist'
// const mongoUrl = process.env.MONGODB_URI
// mongoose.connect(mongoUrl)


// app.use(cors())
// app.use(express.json())

// app.use('/api/blogs', blogsRouter)

// app.get("/", (req, res) => {
//     res.send("<h1>Hi There😅</h1>");
// });

// app.get('/api/blogs', (request, response) => {
//     Blog
//         .find({})
//         .then(blogs => {
//             response.json(blogs)
//         })
// })

// app.post('/api/blogs', (request, response) => {
//     const blog = new Blog({
//         title: request.body.title,
//         author: request.body.author,
//         url: request.body.url,
//         likes: request.body.likes,
//     })

//     blog
//         .save()
//         .then(result => {
//             response.status(201).json(result)
//         })
//         .catch((error) => {
//             console.log(error.message);
//             // next(error);
//         });
// })

// const PORT = process.env.PORT || 3003
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })