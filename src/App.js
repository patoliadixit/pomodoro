import React, { useState, useEffect } from 'react'
let v
function App() {
  const [timePassed, setTimePassed] = useState(0)
  const [start, setStart] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [stopTime, setStopTime] = useState(0)
  const [timeData, setTimeData] = useState([])
  const timer = () => {
    setTimePassed(prev => prev + 0.1) 
  }
  const submitHandler = (event) => {
    event.preventDefault()
    if (!start) {
      setStartTime((new Date()).getTime())
      v = setInterval(timer, 100)
    }
    if (start) {
      clearInterval(v)
      let stop = (new Date()).getTime()
      setStopTime(stop)
      setTimeData(prv => [...prv, { startTime, stopTime: stop, timeTaken: (stop - startTime) }])
    }
    setStart(prev => !prev)
  }

  useEffect(() => {
    console.log(timeData)
  }, [start])

  return (
    <>
      {timePassed}
      <form onSubmit={submitHandler}>
        {/* <input type="text" value={timePassed} /> */}
        <button type="submit">{start ? "stop" : "start"}</button>
      </form>
    </>
  )
}

export default App
