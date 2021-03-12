import React, { useState, useEffect } from 'react'
let stopWatchInterval;

function Stopwatch() {
  const [taskID, setTaskID] = useState(2);
  const [newTask, setNewTask] = useState("");
  const [start, setStart] = useState(false);
  const [timePassed, setTimePassed] = useState(0)
  const [timeData, setTimeData] = useState([])
  const [startTime, setStartTime] = useState();
  const [taskList, setTaskList] = useState([{ id: 0, name: 'one', goal: 0 }, { id: 1, name: 'two', goal: 0 }]);
  const [currentTask, setCurrentTask] = useState(taskList[0] || "task")
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const totalTimeByID = (id) => {
    let result = timeData.find(entry => (
      entry.id === id
    ))
    let sum = 0
    if (result) {
      result.data.forEach(d => (
        sum = d.timeTaken + sum
      ))
    }
    return sum
  }
  const twoDigit = (num) => {
    if (num < 10) {
      num = "0" + num
    }
    return num
  }
  const displayTimer = (time) => {
    let hours = twoDigit(Math.floor(time / 3600)) || "00"
    let minutes = twoDigit(Math.floor((time % 3600) / 60)) || "00"
    let seconds = twoDigit(Math.floor(time % 60)) || "00"
    let display = `${hours}:${minutes}:${seconds}`
    return display
  }
  const stopwatch = (bool, task) => {
    if (bool) {
      setStartTime(Math.floor((new Date()).getTime() / 100) / 10)
      stopWatchInterval = setInterval(() => {
        setTimePassed(prv => prv + 0.1)
      }, 100)
    }
    if (!bool) {
      clearInterval(stopWatchInterval)
      updateData()
    }
  }
  const updateData = () => {
    let sum = totalTimeByID(currentTask.id)
    let stop = Math.floor((new Date()).getTime() / 100) / 10
    if (timeData.length === 0) {
      setTimeData([{
        id: currentTask.id,
        name: currentTask.name,
        goal: currentTask.goal,
        timeSpent: (Math.floor((stop - startTime))),
        data: [{ startTime, stopTime: stop, timeTaken: ((stop - startTime)) }]
      }])
    }
    if (timeData.length !== 0) {
      let result = timeData.find((entry) => (
        entry.name === currentTask.name
      ))
      if (result) {
        let updatedEntryData = result.data.concat([{ startTime, stopTime: stop, timeTaken: ((stop - startTime)) }])
        let updatedData = timeData.filter((entry) => (
          entry.name !== currentTask.name
        ))
        updatedData.push({
          id: currentTask.id, name: currentTask.name, goal: currentTask.goal, timeSpent: (Math.floor((stop - startTime) + sum)), data: updatedEntryData
        })
        setTimeData(updatedData)
      }
      if (!result) {
        setTimeData(prv => ([...prv, {
          id: currentTask.id,
          name: currentTask.name,
          goal: currentTask.goal,
          timeSpent: Math.floor((stop - startTime) + sum),
          data: [{ startTime, stopTime: stop, timeTaken: ((stop - startTime)) }]
        }]))
      }
    }
  }
  const onClickHandler = (event) => {
    event.preventDefault()
    if (!start) {
      stopwatch(true)
      setStart(!start)
    }
    if (start) {
      if (timePassed > 0.1) {
        stopwatch(false)
        setStart(!start)
      }
    }
  }
  const reset = (event) => {
    event.preventDefault()
    if (start) {
      stopwatch(false)
    }
    setStart(false)
    setTimePassed(0)
  }
  const onTaskChange = (event) => {
    event.preventDefault()
    let task = taskList.find(t => (
      t.name === event.target.value
    ))
    setCurrentTask(task)
    setTimePassed(0)
  }
  useEffect(() => {
    console.log(timeData)
    console.log(currentTask)
  }, [timeData, currentTask])

  const newTaskSubmit = (event) => {
    event.preventDefault()
    if (newTask.trim() !== "") {
      let result = taskList.find(val => (
        val.name === newTask
      ))
      if (result) {
        window.alert(`Task with name ${newTask} already exists.`)
      }
      if (!result) {
        let goalTime = (hours * 3600) + (minutes * 60)
        setMinutes(0)
        setHours(0)
        let newTaskWithID = { id: taskID, name: newTask, goal: goalTime }
        setTaskList(prv => [...prv, newTaskWithID])
        setNewTask("")
        setCurrentTask(newTaskWithID)
        setTaskID(prv => prv + 1)
      }
    }
  }
  const newTaskOnChange = (event) => {
    event.preventDefault()
    setNewTask(event.target.value)
  }

  const totalTime = () => {
    let sum = 0
    timeData.forEach(entry => {
      entry.data.forEach(ent => {
        sum = sum + ent.timeTaken
      })
    })
    return sum
  }
  return (
    <>
      <div>
        GrandTotal:::::{displayTimer(Math.floor(totalTime()))}

      </div>
      <div>
        {displayTimer(Math.floor(timeData[currentTask.id]?.timeSpent))}

      </div>
      <div>
        {displayTimer(timePassed)}
      </div>
      <button onClick={onClickHandler}>{!start ? "start" : "stop"}</button>
      <button onClick={reset} disabled={timePassed > 0.1 ? false : true}>Reset</button>
      <select value={currentTask.name} onChange={onTaskChange} disabled={timePassed > 0 ? true : false}>
        {taskList.map((task) => (
          < option value={task.name} key={task.id} >{task.name}</option>
        ))}
      </select>
      <form onSubmit={newTaskSubmit}>
        <input value={newTask} onChange={newTaskOnChange} />
        Hours:<input type="number" value={hours} onChange={(event) => setHours(event.target.value)} />
        Minutes:<input type="number" value={minutes} onChange={(event) => setMinutes(event.target.value)} />
        <button type="submit">Add</button>
      </form>
      {timeData.map(data => (
        <div key={data.id}>
          {data.name}:::::{displayTimer(Math.floor((data.timeSpent)))}
        </div>
      ))}
    </>
  )
}
export default Stopwatch