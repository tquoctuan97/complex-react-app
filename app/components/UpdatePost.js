import Axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import { useImmerReducer } from 'use-immer'

// Components
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function UpdatePost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: '',
      hasError: false,
      message: ''
    },
    body: {
      value: '',
      hasError: false,
      message: ''
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case 'titleChange':
        draft.title.value = action.value
        draft.title.hasError = false
        return
      case 'bodyChange':
        draft.body.value = action.value
        draft.body.hasError = false
        return
      case 'submitRequest':
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++
          draft.isSaving = true
        }
        return
      case 'saveRequestStarted':
        draft.isSaving = true
        return
      case 'saveRequestFinished':
        draft.isSaving = false
        return
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasError = true
          draft.title.message = 'You must provide a title.'
        }
        return
      case 'bodyRules':
        if (!action.value.trim()) {
          draft.body.hasError = true
          draft.body.message = 'You must provide a body content.'
        }
        return
      case 'notFound':
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function handleSubmit(e) {
    e.preventDefault(e)
    dispatch({ type: 'titleRules', value: state.title.value })
    dispatch({ type: 'bodyRules', value: state.body.value })
    dispatch({ type: 'submitRequest' })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: 'fetchComplete', value: response.data })
        } else {
          dispatch({ type: 'notFound' })
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

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' })
      const ourRequest = Axios.CancelToken.source()

      async function sendRequest() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            { cancelToken: ourRequest.token }
          )
          if (response.data == 'success') {
            appDispatch({ type: 'saveRequestFinished' })
            appDispatch({ type: 'messages', value: 'Update Post Successfully' })
            props.history.push(`/post/${state.id}`)
          }
        } catch (e) {
          console.log('There was a problem or the request was cancelled')
        }
      }
      sendRequest()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  }

  return (
    <Page title="Edit Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleChange', value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: 'bodyRules', value: e.target.value })} onChange={e => dispatch({ type: 'bodyChange', value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save New Post
        </button>
      </form>
    </Page>
  )
}

export default withRouter(UpdatePost)
