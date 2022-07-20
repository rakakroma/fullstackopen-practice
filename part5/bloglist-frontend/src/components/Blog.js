import PropTypes from 'prop-types'

import { useState } from 'react'
const Blog = ({ user, blog, updateBlog, handleDelete }) => {

  const [showBlogInfo, setShowBlogInfo] = useState(false)

  const handleShowBlogInfo = () => {
    setShowBlogInfo(!showBlogInfo)
  }

  const blogStyle = {
    padding: 8,
    margin: 10,
    backgroundColor: 'lightgrey'
  }

  const showWhenShowBLogInfo = { display: showBlogInfo ? '' : 'none' }

  const handleLike = () => {
    updateBlog({
      ...blog, likes: blog.likes + 1, user: blog.user._id
    })
  }


  // const confirm = window.confirm('delete', blog.title, '?')
  // if (confirm) {
  // }
  const userCreateThisPost = user.username === blog.user.username


  return <div style={blogStyle} className="blog-post">
    {blog.title} {blog.author}
    <button onClick={handleShowBlogInfo}>{showBlogInfo ? 'hide' : 'view'}</button>
    <div style={showWhenShowBLogInfo}>
      {blog.url}
      <br />
      likes: <span className='likes-count'>{blog.likes || 0}</span>
      <button onClick={handleLike}>👍🏿👍🏿👍🏿</button>
      <br />
      {blog.user.name} bookmarked this.
      <br />
      <button style={{ display: userCreateThisPost ? '' : 'none', backgroundColor: 'red', color: 'whitesmoke' }} onClick={() => handleDelete()}>remove👋</button>
    </div>
  </div>
}

Blog.propTypes = {
  user: PropTypes.object,
  blog: PropTypes.object,
  updateBlog: PropTypes.func,
  handleDelete: PropTypes.func
}

export default Blog