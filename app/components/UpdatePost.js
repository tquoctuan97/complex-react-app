import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'
import LoadingDotsIcon from './LoadingDotsIcon'
import Page from './Page'

function UpdatePost(props) {
  const { id } = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        if (response.data.author.username == appState.user.username) {
          setTitle(response.data.title)
          setBody(response.data.body)
          setIsLoading(true)
        } else {
          appDispatch({ type: 'messages', value: 'No Permission' })
          props.history.push(`/post/${id}`)
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

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post(`/post/${id}/edit`, { title, body, token: appState.user.token })
      if (response.data == 'success') {
        appDispatch({ type: 'messages', value: 'Edited Post Successfully' })
        props.history.push(`/post/${id}`)
      }
      if (response.data == 'failure') {
        appDispatch({ type: 'messages', value: 'Edited Post Failure' })
      }
      if (response.data == 'no permissions') {
        appDispatch({ type: 'messages', value: 'No Permission' })
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (!isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  }

  return (
    <Page title="Create Post">
      <Link className="small font-weight-bold" to={`/post/${id}`}>
        « Back to post permaklink
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={body} onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save Post</button>
      </form>
    </Page>
  )
}

export default withRouter(UpdatePost)
