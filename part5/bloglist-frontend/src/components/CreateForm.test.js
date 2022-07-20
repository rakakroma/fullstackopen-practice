
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { getByPlaceholderText, getByText, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test("use mock func to check the form data sent by CreateForm to createNewBlog func", async () => {

    const mockHandler = jest.fn()

    const container = render(<CreateForm createNewBlog={mockHandler} />).container

    const user = userEvent.setup()

    const titleInput = getByPlaceholderText(container, 'blog title')
    const authorInput = getByPlaceholderText(container, 'blog author')
    const urlInput = getByPlaceholderText(container, 'blog url')

    await user.type(titleInput, 'ReallyGoodBlog')
    await user.type(authorInput, 'Really Good Author')
    await user.type(urlInput, 'www.reallycool.com')

    const submitButton = getByText(container, 'post blog')
    await user.click(submitButton)

    expect(mockHandler.mock.calls[0][0].title).toBe('ReallyGoodBlog')
    expect(mockHandler.mock.calls[0][0].author).toBe('Really Good Author')
    expect(mockHandler.mock.calls[0][0].url).toBe('www.reallycool.com')
    expect(mockHandler.mock.calls[0][0].likes).toBe(0)

})