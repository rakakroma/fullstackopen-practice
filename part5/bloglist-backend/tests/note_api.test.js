const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')



describe("no blog , one user initial, login and get token", () => {

    let token;
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    beforeAll(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('fakepassword', 10)
        const user = new User({ username: "fakeuser", name: "Faker", passwordHash })
        await user.save();

        const res = await api
            .post('/api/login')
            .send({
                "username": "fakeuser",
                "password": "fakepassword"
            })

        token = res.body.token

        console.log('--before-token--', token);
    })


    test("create new valid user", async () => {

        const allUserBeforeCreate = await helper.usersInDB();

        const validUser = {
            "username": "noproblem",
            "name": "Good Guy",
            "password": "realpassword"
        }

        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const allUserAfterCreate = await helper.usersInDB();
        expect(allUserAfterCreate).toHaveLength(allUserBeforeCreate.length + 1)
    })


    test("send invalid user which should not be created", async () => {

        const allUserBeforeCreate = await helper.usersInDB();

        const invalidPasswordUser = {
            "username": "kfvk",
            "name": "xefkpoe",
            "password": "n"
        }

        await api
            .post('/api/users')
            .send(invalidPasswordUser)
            .expect(400)

        const invalidNamedUser = {
            "username": "okusername",
            "name": "x",
            "password": "okpassword"
        }

        await api
            .post('/api/users')
            .send(invalidNamedUser)
            .expect(400)

        const allUserAfterCreate = await helper.usersInDB();
        expect(allUserAfterCreate).toHaveLength(allUserBeforeCreate.length)
    })


    // test('login to get token', async () => {

    //     const loginUser = {
    //         "username": "fakeuser",
    //         "password": "fakepassword"
    //     }

    //     const res = await api
    //         .post('/api/login')
    //         .send(loginUser)
    //         .expect(200)

    //     console.log("token", res.body.token);


    // })


    test("there should be user in a new posted blog, try real token and fake token", async () => {

        const newBlog = {
            "title": "Simple",
            "author": "S T U V W Z a b c d e f g h i j k l X m H",
            "url": "www.qqqqqqqqq.com",
            "likes": 66
        }

        const res = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)

        expect(res.body.user).toBeDefined()
        // console.log(res.body.user);

        //use fakeToken
        const newBlogforfakeToken = {
            "title": "notSimple",
            "author": "kS T U V W Z a b c d e f g h i j k l X m H",
            "url": "www.wwwqqqqqqqqq.com",
            "likes": 66
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send(newBlogforfakeToken)
            .expect(401)

    })

    describe("insert 2 blogs first", () => {

        //use user and token created above


        beforeEach(async () => {
            await Blog.deleteMany({})
            // let blogObject = new Blog(helper.initialBlogs[0])
            // await blogObject.save()
            // blogObject = new Blog(helper.initialBlogs[1])
            // await blogObject.save()

            // await Blog.insertMany(helper.initialBlogs)
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(helper.initialBlogs[0])

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(helper.initialBlogs[1])
        })



        test('blog infos are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

        }, 100000)

        test('verify id property name', async () => {
            const response = await api.get('/api/blogs')
            response.body.forEach(blog => {
                expect(blog.id).toBeDefined()
                console.log(blog);
            });
        }, 100000)

        test('post blog + 1 blog in database, and that post really in database', async () => {

            const newBlog = {
                "title": "Simple",
                "author": "S T U V W Z a b c d e f g h i j k l X m H",
                "url": "www.qqqqqqqqq.com",
                "likes": 66
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            const titles = response.body.map(r => r.title)

            expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
            expect(titles).toContain('Simple')
        })

        test('if send without likes property should return 0', async () => {

            const likeZeroBlog = {
                "title": "Zero",
                "author": "zeeerrrro",
                "url": "www.zero.com"
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(likeZeroBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')

            const responseLikeZeroBlog = response.body.find(blog => blog.title === "Zero")
            // console.log(responseLikeZeroBlog);
            expect(responseLikeZeroBlog.likes).toEqual(0)
        })

        test('if send without title or author responds 404', async () => {

            const withoutTitleBlog = {
                "author": "zeeerrrro",
                "url": "www.zero.com",
                "likes": 2
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(withoutTitleBlog)
                .expect(400)

            //fake token
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${fakeToken}`)
                .send(withoutTitleBlog)
                .expect(401)


            const withoutAuthorBlog = {
                "title": "A ha",
                "url": "www.zero.com",
                "likes": 2
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(withoutAuthorBlog)
                .expect(400)

            //fake token
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${fakeToken}`)
                .send(withoutAuthorBlog)
                .expect(401)

            const withoutBothBlog = {
                "url": "www.failed.com",
                "likes": 4
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(withoutBothBlog)
                .expect(400)

            //fake token
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${fakeToken}`)
                .send(withoutBothBlog)
                .expect(401)

        }

        )

        test('delete single blog post by id', async () => {
            const currentData = await helper.blogsInDB()
            const blogToDelete = currentData[0]
            //try fake token first
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${fakeToken}`)
                .expect(401)

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const dataAfterDelete = await helper.blogsInDB()

            expect(dataAfterDelete).toHaveLength(currentData.length - 1);

            const titles = dataAfterDelete.map(blog => blog.title)

            expect(titles).not.toContain(blogToDelete.title);

        })

        test('update a blog post by id', async () => {

            const currentData = await helper.blogsInDB()
            const blogToUpdate = currentData[1]

            console.log(blogToUpdate);

            const blogPlusOneLike = {
                "title": blogToUpdate.title,
                "author": blogToUpdate.author,
                "url": blogToUpdate.url,
                "likes": blogToUpdate.likes + 1
            }

            console.log(blogPlusOneLike);
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogPlusOneLike)
                .expect(200)

            const dataAfterUpdate = await helper.blogsInDB()

            expect(dataAfterUpdate).toHaveLength(currentData.length);

            const blogAfterUpdate = dataAfterUpdate.find(blog => blog.id === blogToUpdate.id);

            expect(blogAfterUpdate.likes).toEqual(blogToUpdate.likes + 1);
            expect(blogAfterUpdate.title).toBe(blogToUpdate.title);
            expect(blogAfterUpdate.url).toBe(blogToUpdate.url);
            expect(blogAfterUpdate.author).toBe(blogToUpdate.author);


        })
    })


})





afterAll(() => {
    mongoose.connection.close()
})