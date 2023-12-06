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
    <div>
      <Part part={content.part1}/>
      <Part part={content.part2}/>
      <Part part={content.part3}/>
    </div>
  )
}

const Part = (part) => {
  return (
    <>
      <p>
        {part.part.name} {part.part.exercises}
        </p>
    </>
  )
}

const Total = (total) => {
  return (
    <>
      <p>Number of exercises {total.part1.exercises + total.part2.exercises + total.part3.exercises}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content part1={part1} part2={part2} part3={part3} />
      <Total part1={part1} part2={part2} part3={part3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

