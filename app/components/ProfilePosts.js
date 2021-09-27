import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import LoadingDotIcon from './LoadingDotIcon'

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fecthData() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(true)
      } catch (e) {
        console.log('Something was wrong :(')
      }
    }
    fecthData()
  }, [username])

  if (!isLoading) {
    return <LoadingDotIcon />
  }

  return (
    <div className="list-group">
      {posts.map(post => {
        const createdDate = new Date(post.createdDate)
        const dateFormat = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`

        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
            <span className="text-muted small"> on {dateFormat} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
