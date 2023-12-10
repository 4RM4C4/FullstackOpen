import React from 'react'
import Part from './Part'

const Content = ({content}) => content.map((map) => <Part key={map.id} part={map}/>)

export default Content