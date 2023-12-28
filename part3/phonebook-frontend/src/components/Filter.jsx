import React from 'react'

const Filter = ({value, action}) => <div> Filter shown with: <input value={value} onChange={action} /> </div>

export default Filter