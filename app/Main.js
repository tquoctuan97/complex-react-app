import React from 'react'
import ReactDOM from 'react-dom'

function ExmapleComponent() {
  return (
    <div>
      <h1>This is our app!!</h1>
      <p>The sky is blue 6</p>
    </div>
  )
}

ReactDOM.render(<ExmapleComponent />, document.querySelector('#app'))

if (module.hot) {
  module.hot.accept()
}
