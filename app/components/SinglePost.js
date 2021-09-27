import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

// Components
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

function SinglePost() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          setPost(response.data)
          setIsLoading(true)
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled')
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (!isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  }

  const createdDate = new Date(post.createdDate)
  const dateFormat = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`

  return (
    <Page title="Example Post Title">
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </a>{' '}
          <ReactTooltip id="edit" className="custom-tooltip" />
          <a data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormat}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={['paragraph', 'strong', 'emphasis', 'text', 'heading', 'image', 'list', 'listItem']} />
      </div>
    </Page>
  )
}

export default SinglePost
