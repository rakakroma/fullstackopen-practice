import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('test render result', () => {


    const blog = {
        id: '62d56c3f112b1966aaaad8',
        title: 'hereistitle',
        author: 'hereisauthor',
        url: 'www.url.com',
        likes: 6,
        user: {
            id: "62d56c3f112b19664deecdd8",
            name: "Faker",
            username: "fakeuser"
        }
    }

    const user = {
        name: "Faker",
        username: "fakeuser",
        token: 'thetoken1111'
    }


    test('renders title and author, hide url and likes', () => {

        render(<Blog blog={blog} user={user} />)

        const elementContainTitle = screen.getByText(/hereistitle/)
        expect(elementContainTitle).toBeDefined()

        const elementContainAuthor = screen.getByText(/hereisauthor/)
        expect(elementContainAuthor).toBeDefined()

        const elementContainUrl = screen.getByText(/www.url.com/)
        expect(elementContainUrl).toHaveStyle('display: none')

        const elementContainLikes = screen.getByText(/likes/)
        expect(elementContainLikes).toHaveStyle('display: none')
    })
    test("click view button, show likes and url of blog", async () => {

        render(<Blog blog={blog} user={user} />)

        const viewButton = screen.getByText('view')
        const userAction = userEvent.setup()
        await userAction.click(viewButton)

        const elementContainUrl = screen.getByText(/www.url.com/)
        expect(elementContainUrl).not.toHaveStyle('display: none')

        const elementContainLikes = screen.getByText(/likes/)
        expect(elementContainLikes).not.toHaveStyle('display: none')
    })


    test("function to handle like will be called twice after click 'like' button 2 times ", async () => {

        const mockHandler = jest.fn()

        render(<Blog blog={blog} user={user} updateBlog={mockHandler} />)

        const likeButton = screen.getByText('👍🏿👍🏿👍🏿')
        const userAction = userEvent.setup()
        await userAction.click(likeButton)
        await userAction.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)

    })


})

// test('clicking the button calls event handler once', async () => {
//     // const note = {
//     //     content: 'Component testing is done with react-testing-library',
//     //     important: true
//     // }

//     const mockHandler = jest.fn()

//     render(
//         <Note note={note} toggleImportance={mockHandler} />
//     )

//     const button = screen.getByText('make not important')
//     userEvent.click(button)

//     expect(mockHandler.mock.calls).toHaveLength(1)
// })