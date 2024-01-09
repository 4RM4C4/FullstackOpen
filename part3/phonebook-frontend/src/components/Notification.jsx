import React from 'react'

function Notification({ ErrorMessage }) {
  if (ErrorMessage === null) {
    return null
  }
  if (ErrorMessage.status === 'ok') {
    return (
      <div className="errorok">
        {ErrorMessage.message}
      </div>
    )
  }
  if (ErrorMessage.status === 'nok') {
    return (
      <div className="errornok">
        {ErrorMessage.message}
      </div>
    )
  }

  return (
    <div className="errornok">
      {ErrorMessage.message}
    </div>
  )
}

export default Notification
