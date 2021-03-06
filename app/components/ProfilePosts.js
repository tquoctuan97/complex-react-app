import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Post from './Post'
import LoadingDotsIcon from './LoadingDotsIcon'

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fecthData() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(true)
      } catch (e) {
        console.log('There was a problem or the request was cancelled')
      }
    }
    fecthData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (!isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post post={post} key={post._id} noAuthor="true" />
      })}
    </div>
  )
}

export default ProfilePosts
