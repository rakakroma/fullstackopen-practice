
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {

    const AllUserResult = await User
        .find({})
        .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

    response.json(AllUserResult)
})

// usersRouter.get('/:id', async (request, response) => {
//     const user = await User.findById(request.params.id)
//     if (user) {
//         response.json(user)
//     } else {
//         response.status(404).end()
//     }
// })


usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    const invalidPassword = password.length < 3

    if (invalidPassword) {
        return response.status(400).json({ error: 'password must be at least 3 characters' })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return response.status(400).json({ error: 'Username already exists' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)


    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save();
    response.status(201).json(savedUser)

})


module.exports = usersRouter