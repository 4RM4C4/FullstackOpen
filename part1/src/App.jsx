import { useState } from 'react'
const Title = ({text}) => <h1>{text}</h1>

const Statistics = ({good, neutral, bad}) => (
  <>
      <Title text='Statistics'/><br/>
      <Show item={good} text='Good: '/>
      <Show item={neutral} text='Neutral: '/>
      <Show item={bad} text='Bad: '/>
      <Sum item1={good} item2={neutral} item3={bad} text='All:'/>
      <Avg item1={good} item2={neutral} item3={bad} text='Average:'/>
      <Pos item1={good} item2={neutral} item3={bad} text='Positive:'/>
  </>
      )

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Show =  ({item, text}) => <div>{text} {item}</div>

const Sum =  ({item1, item2, item3,  text}) => <div>{text} {item1+item2+item3}</div>

const Avg =  ({item1, item2, item3,  text}) => {
  if((item1+item2+item3)==0) {
    return <div>{text} There is not enough data to calculate.</div>
  }
  return <div>{text} {(item1+(item3*-1))/(item1+item2+item3)}</div>
}

const Pos = ({item1, item2, item3,  text}) => {
  if((item1+item2+item3)==0) {
    return <div>{text} There is not enough data to calculate.</div>
  }
return <div>{text} {(item1*100)/(item1+item2+item3)}%</div>
}

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