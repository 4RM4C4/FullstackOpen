const Notification = ({ ErrorMessage }) => {
  if (ErrorMessage === null) {
    return null
  } else {
    if (ErrorMessage.status === "ok") {
      return (<div className="errorok">
        {ErrorMessage.message}
      </div>)
    }
    if (ErrorMessage.status === 'nok') {
      return (<div className="errornok">
        {ErrorMessage.message}
      </div>)
    }
  }

  return (
    <div className="errornok">
      {ErrorMessage.message}
    </div>
  )
}

export default Notification