import React from 'react'
import ReactDOM from 'react-dom'

const Header = (header) => {
  return (
    <>
      <h1>{header.course}</h1>
    </>
  )
}

const Content = (content) => {
  return (
    <>
      <p>
        {content.part} {content.exercises}
        </p>
    </>
  )
}

const Total = (total) => {
  return (
    <>
      <p>Number of exercises {total.exercises1 + total.exercises2 + total.exercises3}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content part={part1} exercises={exercises1} />
      <Content part={part2} exercises={exercises2} />
      <Content part={part3} exercises={exercises3} />
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

