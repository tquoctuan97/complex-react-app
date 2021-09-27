import React from 'react'

function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        const addClass = msg.status == 'error' ? 'alert-danger' : 'alert-success'
        return (
          <div key={index} className={`alert ${addClass} text-center floating-alert`}>
            {msg.content}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
