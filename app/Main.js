import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || 'http://m2-social.herokuapp.com/'

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
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('complexappToken')))
  const [flashMessages, setFlashMessages] = useState([])

  function addFlashMessages(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <FlashMessages messages={flashMessages} />
      <Switch>
        <Route path="/" exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/create-post">
          <CreatePost setFlashMessages={addFlashMessages} />
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
  )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if (module.hot) {
  module.hot.accept()
}
