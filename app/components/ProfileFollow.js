import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'

function ProfileFollow(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [userList, setUserList] = useState([])

  useEffect(() => {
    setIsLoading(true)
    const sendRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.type}`, { cancelToken: sendRequest.token })
        if (response.data) {
          setUserList(response.data)
          setIsLoading(false)
        }
      } catch (e) {
        console.log('There was a problem or the request was cancelled')
      }
    }
    fetchData()
    return () => {
      sendRequest.cancel()
    }
  }, [props.type])

  if (isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <div className="list-group">
      {userList.map((userItem, index) => {
        return (
          <Link key={index} to={`/profile/${userItem.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={userItem.avatar} />
            {userItem.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollow
