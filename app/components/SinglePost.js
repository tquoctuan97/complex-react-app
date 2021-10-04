import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

// Components
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function SinglePost(props) {
  const { id } = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          setPost(response.data)
          setIsLoading(false)
        } else {
          setNotFound(true)
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

  async function handleDelete() {
    const areYouSure = window.confirm('Do you really want to delete this post?')
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == 'success') {
          // 1. display a flash message
          appDispatch({ type: 'messages', value: 'Post was successfully deleted.' })

          // 2. redirect back to the current user's profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log('There was a problem.')
      }
    }
  }

  if (notFound) {
    return <NotFound />
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  }

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  const createdDate = new Date(post.createdDate)
  const dateFormat = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`

  return (
    <Page title="Example Post Title">
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>{' '}
            <ReactTooltip id="edit" className="custom-tooltip" />
            <a onClick={handleDelete} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
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

export default withRouter(SinglePost)
