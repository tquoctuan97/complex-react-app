import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import StateContext from '../StateContext'
import Page from './Page'
import ProfilePosts from './ProfilePosts'
import NotFound from './NotFound'
import { useImmer } from 'use-immer'

function Profile() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'https://www.gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: { postCount: 0, followerCount: 0, followingCount: 0 }
    },
    notFound: false
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
        if (response.data) {
          setState(draft => {
            draft.profileData = response.data
          })
        } else {
          setState(draft => {
            draft.notFound = true
          })
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled')
        setState(draft => {
          draft.notFound = true
        })
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = Axios.CancelToken.source()

      async function sendRequest() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          if (response.data) {
            setState(draft => {
              draft.profileData.isFollowing = true
              draft.followActionLoading = false
              draft.profileData.counts.followerCount++
            })
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
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = false
      })
      const ourRequest = Axios.CancelToken.source()

      async function sendRequest() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token })
          if (response.data) {
            setState(draft => {
              draft.profileData.isFollowing = false
              draft.followActionLoading = false
              draft.profileData.counts.followerCount--
            })
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
  }, [state.stopFollowingRequestCount])

  function followHandler(e) {
    e.preventDefault()
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  function unfollowHandler() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }

  if (state.notFound == true) {
    return <NotFound />
  }

  return (
    <Page title={`Profile ${username}`}>
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && state.profileData.profileUsername != appState.user.username && state.profileData.profileUsername != '...' && (
          <button onClick={followHandler} className="btn btn-primary btn-sm ml-2" disabled={state.followActionLoading}>
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && state.profileData.profileUsername != appState.user.username && state.profileData.profileUsername != '...' && (
          <button onClick={unfollowHandler} className="btn btn-danger btn-sm ml-2" disabled={state.followActionLoading}>
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  )
}

export default Profile
