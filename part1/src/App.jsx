import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>
const Show =  ({item, text}) => <div>{text} {item}</div>
const Title = ({text}) => <h1>{text}</h1>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title text='Give feedback'/>
      <br/>
      <Button handleClick={() => setGood(good+1)} text='Good'/>
      <Button handleClick={() => setNeutral(neutral+1)} text='Neutral'/>
      <Button handleClick={() => setBad(bad+1)} text='Bad'/>
      <br/>
      <Title text='Statistics'/>
      <br/>
      <Show item={good} text='Good: '/>
      <Show item={neutral} text='Neutral: '/>
      <Show item={bad} text='Bad: '/>
    </div>
  )
}

export default App