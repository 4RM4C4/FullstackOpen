import React from 'react'

const Total = ({total}) => <p><strong>Number of exercises: {total.reduce((sum, order) => sum+order.exercises, 0)}</strong></p>

export default Total