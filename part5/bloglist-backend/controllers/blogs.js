const blogsRouter = require('express').Router()
const User = require('../models/user')
// const { request } = require('../app')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7)
//     }
//     return null
// }


blogsRouter.get('/', async (request, response) => {
    const AllBlogResult = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(AllBlogResult)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})


blogsRouter.post('/', async (request, response) => {


    const { title, author, url, likes } = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user

    console.log('is user exist?', user);

    const blog = new Blog({
        // title: request.body.title,
        // author: request.body.author,
        // url: request.body.url,
        // likes: request.body.likes,
        title,
        author,
        url,
        likes,
        user: user._id
    })

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog)


})

blogsRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()

    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user



    if (blog && user.blogs.includes(request.params.id)) {
        await Blog
            .findByIdAndDelete(request.params.id)
        response.status(204).end();
    } else {
        response.status(403).json({ error: ' you do not have permission to delete this blog' });
    }
})


blogsRouter.put('/:id', async (request, response) => {


    const targetBlog = await Blog.findById(request.params.id)
    if (!targetBlog) {
        return response.status(404).end()
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    // const user = request.user

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        _id: request.params.id,
    })


    // if (user.blogs.includes(request.params.id)) {
    //     const updatedBlog = await Blog
    //         .findByIdAndUpdate(request.params.id, blog, { new: true })
    //     response.json(updatedBlog)
    // } else {
    //     response.status(403).json({ error: ' you do not have permission to delete this blog' });
    // }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)

})




module.exports = blogsRouter