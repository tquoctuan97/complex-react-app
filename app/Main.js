import React, { useState, useContext, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || 'http://m2-social.herokuapp.com/'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

// Our Components
import Header from './components/Header'
import FlashMessages from './components/FlashMessages'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import SinglePost from './components/SinglePost'

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: []
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case 'login':
        return { loggedIn: true, flashMessages: state.flashMessages }
      case 'logout':
        return { loggedIn: false, flashMessages: state.flashMessages }
      case 'messages':
        return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) }
    }
  }

  const [state, dispatch] = useReducer(ourReducer, initialState)

  function addFlashMessages(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <FlashMessages messages={state.flashMessages} />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id">
              <SinglePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if (module.hot) {
  module.hot.accept()
}
