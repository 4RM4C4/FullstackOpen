import { useState } from 'react'
const Title = ({text}) => <h1>{text}</h1>

const Statistics = ({good, neutral, bad}) => {
  
  const total= (good+neutral+bad)
  const average = ((good+(bad*-1))/(good+neutral+bad))
  const positives = ((good*100)/(good+neutral+bad))+'%'

  if(total==0){
    return (
      <>
      <Title text='Statistics'/><br/>
      <div>No feedback given.</div>
      </>
    )
  }
  return (
  <>
      <Title text='Statistics'/><br/>
      <StatisticLine item={good} text='Good:'/>
      <StatisticLine item={neutral} text='Neutral:'/>
      <StatisticLine item={bad} text='Bad:'/>
      <StatisticLine item={total} text='All:'/>
      <StatisticLine item={average} text='Average:'/>
      <StatisticLine item={positives} text='Positive:'/>
  </>
      )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine =  ({item, text}) => <div>{text} {item}</div>


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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App