import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = process.env.BACKENDURL || 'http://m2-social.herokuapp.com/'

// Our Components
import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'

function Main() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <HomeGuest />
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
