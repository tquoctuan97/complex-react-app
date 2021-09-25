import React from 'react'
import ReactDOM from 'react-dom'
import { useImmerReducer } from 'use-immer'
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

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'messages':
        draft.flashMessages.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

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
