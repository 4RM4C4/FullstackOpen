import React from 'react'

const Total = ({total}) => <p>Number of exercises: {total.reduce((sum, order) => sum+order.exercises, 0)}</p>

export default Total