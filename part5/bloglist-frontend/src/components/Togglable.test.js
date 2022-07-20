import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {

    let container;

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show">
                <div className='testDiv'>
                    text inside testDiv
                </div>
            </Togglable>
        ).container
    })

    test('renders its children', async () => {
        const childrenOfTogglable = await screen.findAllByText('text inside testDiv')
        expect(childrenOfTogglable).toBeDefined()
    })


    test('at start the children are not displayed', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })


    test('after clicking the button, children are displayed', async () => {
        const button = screen.getByText('show')
        const user = userEvent.setup()
        // userEvent.click(button)

        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')

    })

    test('toggled content can be closed', async () => {
        const button = screen.getByText('show')
        // userEvent.click(button)
        const user = userEvent.setup()
        await user.click(button)


        const closeButton = screen.getByText('cancel')
        await user.click(closeButton)
        // userEvent.click(closeButton)

        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })


})

