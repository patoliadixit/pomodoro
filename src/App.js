import React, { useState, useEffect } from 'react'
let v
let vv

function App() {
  const [timePassed, setTimePassed] = useState(0)
  const [start, setStart] = useState(false)
  const [startTimer, setStartTimer] = useState(false);
  const [startTime, setStartTime] = useState(0)
  const [timeData, setTimeData] = useState([])
  const [timerTime, setTimerTime] = useState(0)
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();
  const [total, setTotal] = useState(0);
  const [totalTimeFromData, setTotalTimeFromData] = useState(0);
  const [target, setTarget] = useState([]);
  const [pomodoro, setPomodoro] = useState({ work: 25, break: 5, long_break: 15, repeat: 4 });
  const saveData = () => {
    let stop = (new Date()).getTime()
    setTimeData(prv => [...prv, { startTime, stopTime: stop, timeTaken: (stop - startTime) }])
  }

  const displayTimer = (time) => {
    let hours = Math.floor(time / 3600) || "00"
    let minutes = Math.floor((time % 3600) / 60) || "00"
    let seconds = Math.floor(time % 60) || "00"
    let display = `${hours}:${minutes}:${seconds}`
    return display
  }

  const timerUpdate = () => {
    setTimePassed(prev => prev + 0.1)
    setTotal(prv => prv + 0.1)
  }

  const onClickHandler = (event) => {
    event.preventDefault()
    if (!start) {
      setStartTime((new Date()).getTime())
      v = setInterval(timerUpdate, 100)
    }
    if (start) {
      clearInterval(v)
      saveData()
    }
    setStart(prev => !prev)
  }

  useEffect(() => {
    console.log(timeData)
  }, [start])

  const timerReset = () => {
    if (timePassed > 0) {
      setTimePassed(0)
      clearInterval(v)
      start && saveData()
      start && setStart(!start)
    }
  }
  const timerUpdateReduce = () => {
    setTimerTime(prev => prev - 0.1)
    setTotal(prv => prv + 0.1)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault()
    console.log(timerHours, timerSeconds, timerMinutes)
    if (!startTimer) {
      let time = timerTime || ((parseInt(timerHours) || 0) * 3600) + ((parseInt(timerMinutes) || 0) * 60) + (parseInt(timerSeconds) || 0)
      setTimerTime(time)
      if (time > 0) {
        vv = setInterval(timerUpdateReduce, 100)
        setTimerHours(0)
        setTimerMinutes(0)
        setTimerSeconds(0)
        setStartTimer(prv => !prv)
        setStartTime((new Date()).getTime())
      }
    }
    if (startTimer) {
      clearInterval(vv)
      let stop = (new Date()).getTime()
      setStartTimer(prv => !prv)
    }
  }
  useEffect(() => {
    if (startTimer && timerTime <= 0.1) {
      setStartTimer(!startTimer)
      clearInterval(vv)
      saveData()
    }
  }, [timerTime])
  const onHoursChangeHandler = (event) => {
    event.preventDefault()
    setTimerHours(event.target.value)
  }
  const onMinutesChangeHandler = (event) => {
    event.preventDefault()
    setTimerMinutes(event.target.value)
  }
  const onSecondsChangeHandler = (event) => {
    event.preventDefault()
    setTimerSeconds(event.target.value)
  }
  const resetHandler = (event) => {
    event.preventDefault()
    clearInterval(vv)
    setTimerHours(0)
    setTimerMinutes(0)
    setTimerSeconds(0)
    setTimerTime(0)
    setStartTimer(false)
  }
  useEffect(() => {
    let sum = 0;
    timeData.forEach(data => {
      sum = sum + data.timeTaken
    })
    setTotalTimeFromData(Math.floor(sum / 1000))
  }, [timeData])
  
  return (
    <>
      Total Time from Data: {totalTimeFromData}<hr />
      Total Time: {Math.floor(total)}<hr />
      {displayTimer(timePassed)}
      <button onClick={onClickHandler}>{start ? "stop" : "start"}</button>
      <button onClick={timerReset}>reset</button>
      <br /><br /><br />
      {displayTimer(timerTime)}
      <form onSubmit={onSubmitHandler}>
        {!startTimer &&
          <div>
            <input type="text" value={timerHours} onChange={onHoursChangeHandler} />
            <input type="text" value={timerMinutes} onChange={onMinutesChangeHandler} />
            <input type="text" value={timerSeconds} onChange={onSecondsChangeHandler} />
          </div>
        }
        {/* <input type="text" value={timerHours} onChange={(event) => setTimerHours(event.target.value)} />
        <input type="text" value={timerMinutes} onChange={(event) => setTimerMinutes(event.target.value)} />
        <input type="text" value={timerSeconds} onChange={(event) => setTimerSeconds(event.target.value)} /> */}
        <button type="submit">{!startTimer ? "start" : "stop"}</button>
      </form>
      <button type="reset" onClick={resetHandler}>reset</button>
    </>
  )
}

export default App
