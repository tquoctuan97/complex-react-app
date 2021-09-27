import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import StateContext from '../StateContext'
import Page from './Page'
import ProfilePosts from './ProfilePosts'

function Profile() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://www.gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}`, { token: appState.user.token })
        setProfileData(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [username])

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
