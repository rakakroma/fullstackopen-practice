
// const mongoUrl = process.env.MONGODB_URI
// mongoose.connect(mongoUrl)


// app.use(cors())
// app.use(express.json())

// app.use('/api/blogs', blogsRouter)

const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const middleware = require('./utils/middleware')
// const logger = require('./utils/logger')
const mongoose = require('mongoose')



// logger.info('connecting to', config.MONGODB_URI)
console.log('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        // logger.info('connected to MongoDB')
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        // logger.error('error connecting to MongoDB:', error.message)
        console.error('error connecting to MongoDB:', error.message)

    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}


// app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app