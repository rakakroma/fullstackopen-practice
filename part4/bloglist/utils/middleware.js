const jwt = require('jsonwebtoken');
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    // logger.info('Method:', request.method)
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}


const errorHandler = (error, request, response, next) => {
    // logger.error(error.message)

    console.log(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {

    const getTokenFrom = request => {
        const authorization = request.get('authorization')
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            return authorization.substring(7)
        }
        return null
    }
    request.token = getTokenFrom(request)
    next()
}

const userExtractor = async (request, response, next) => {

    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    }

    next()
}

module.exports = {
    requestLogger,
    // unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}