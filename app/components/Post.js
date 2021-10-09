import React from 'react'
import { Link } from 'react-router-dom'

function Post(props) {
  const post = props.post
  const createdDate = new Date(post.createdDate)
  const dateFormat = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`

  return (
    <Link onClick={props.onClick} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{' '}
      <span className="text-muted small">
        {!props.noAuthor && <>by {post.author.username} </>} on {dateFormat}
      </span>
    </Link>
  )
}

export default Post
