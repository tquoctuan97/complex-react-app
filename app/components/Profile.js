import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import StateContext from '../StateContext'
import Page from './Page'
import ProfilePosts from './ProfilePosts'
import NotFound from './NotFound'

function Profile() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [notFound, setNotFound] = useState(false)
  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://www.gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 }
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}`, { token: appState.user.token, cancelToken: ourRequest.token })
        if (response.data) {
          setProfileData(response.data)
        } else {
          setNotFound(true)
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled')
        setNotFound(true)
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (notFound) {
    return <NotFound />
  }

  return (
    <Page title={`Profile ${username}`}>
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
        {profileData.isFollowing ? (
          <button className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        ) : (
          <button className="btn btn-danger btn-sm ml-2">
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  )
}

export default Profile
