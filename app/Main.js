import React from 'react'
import ReactDOM from 'react-dom'
import Footer from './Footer'

// Our Components
import Header from './Header'
import HomeGuest from './HomeGuest'

function Main() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if (module.hot) {
  module.hot.accept()
}
