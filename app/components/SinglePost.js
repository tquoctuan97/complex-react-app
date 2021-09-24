import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Page from './Page'

function SinglePost() {
  const { id } = useParams()
  const [hasPost, setHasPost] = useState()
  const [post, setPost] = useState()

  useEffect(async () => {
    try {
      const response = await Axios.get(`/post/${id}`)
      console.log(response.data)
      if (response.data) {
        setPost(response.data)
        setHasPost(true)
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <Page title="Example Post Title">
      <div className="d-flex justify-content-between">
        <h2>{hasPost ? post.title : ''}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img className="avatar-tiny" src={hasPost ? post.author.avatar : ''} />
        </a>
        Posted by <a href="#">{hasPost ? post.author.username : ''}</a> on {hasPost ? post.createdDate : ''}
      </p>

      <div className="body-content">{hasPost ? post.body : ''}</div>
    </Page>
  )
}

export default SinglePost
