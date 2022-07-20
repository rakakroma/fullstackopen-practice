import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    Togglable.displayName = 'Togglable'

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <>
            <span style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </span>
            <div style={showWhenVisible} className="togglableContent">
                {props.children}
                <button onClick={toggleVisibility}>{props.cancelButtonLabel || 'cancel'}</button>
            </div>


        </>
    )

})

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    cancelButtonLabel: PropTypes.string
}

export default Togglable