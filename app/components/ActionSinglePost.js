import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

function ActionSinglePost(props) {
  return (
    <span className="pt-2">
      <Link to={`/post/${props.id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
        <i className="fas fa-edit"></i>
      </Link>{' '}
      <ReactTooltip id="edit" className="custom-tooltip" />
      <a data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
        <i className="fas fa-trash"></i>
      </a>
      <ReactTooltip id="delete" className="custom-tooltip" />
    </span>
  )
}

export default ActionSinglePost
