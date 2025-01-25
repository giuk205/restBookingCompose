import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/*
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/LivePortal";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
    <Router>
      <div>
      <Navbar />
      <Routes>
        <Route path="/" exact page={Home} />
        <Route path="/User" exact page={User} />
      </Routes>
    </Router>
      <h1 className="text-3xl font-bold underline bg-amber-100 ">
        Hello Tailwind!!!
      </h1>

      <div>
      LoginModal /
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      */
import BookingCalendar from './components/BookingCalendar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <BookingCalendar maxGuests ={10} message = {"Questo è un messaggio"}/>
    </>
  )
}

export default App
