import React from 'react'

function Filter({ value, action }) {
  return (
    <div>
      {' '}
      Filter shown with:
      {' '}
      <input value={value} onChange={action} />
    </div>
  )
}

export default Filter
