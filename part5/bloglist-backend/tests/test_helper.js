const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "A",
        "author": "AA",
        "url": "www.aaa.com",
        "likes": 1
    },
    {
        "title": "B",
        "author": "bb",
        "url": "www.bbb.com",
        "likes": 2
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: "dddd", author: "vvvvv", url: "www.remove.com" })
    await blog.save()
    await blog.remove()

    return note._id.toString()
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDB, usersInDB
}