import React, { useEffect } from 'react'

function HeaderLoggedIn() {
  return (
    <>
      <div class="flex-row my-3 my-md-0">
        <a href="#" class="text-white mr-2 header-search-icon">
          <i class="fas fa-search"></i>
        </a>
        <span class="mr-2 header-chat-icon text-white">
          <i class="fas fa-comment"></i>
          <span class="chat-count-badge text-white"> </span>
        </span>
        <a href="#" class="mr-2">
          <img class="small-header-avatar" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" />
        </a>
        <a class="btn btn-sm btn-success mr-2" href="/create-post">
          Create Post
        </a>
        <button class="btn btn-sm btn-secondary">Sign Out</button>
      </div>
    </>
  )
}

export default HeaderLoggedIn
