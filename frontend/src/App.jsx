import { useState, useRef} from 'react'
import Navbar from "./components/Navbar";
import Login from './pages/Login'
import Register from './pages/Register'
import BookingCalendar from './pages/BookingCalendar'
import User from './pages/User'

/*
import Staff from './pages/Staff'
*/
import Home from './pages/Home'
import './App.css'
import {  PageForm, UserType } from  './globals';



function App() {
  // Form attivo
  const [activeForm, setActiveForm] = useState(PageForm.HOME); // defined in globals.PageForm
  const [prevForm, setPrevForm] = useState(PageForm.HOME);     // defined in globals.PageForm

  // Quando loggato idUser dell'utente
  const [idUser, setIdUser] = useState(null);
  // Quando loggato tipo di utente (0 = admin, 10 = manager, 20 = staff, 30 = user)
  const [userPrivileges, setUserPrivileges] = useState(UserType.USER); // defined in globals.UserType);


  const homeRef = useRef(null); //Per ripristinare la posizione in Home

  console.log("App.jsx - activeForm:", activeForm);
  console.log("App.jsx - prevForm:", prevForm);
  return (
    <>
    {}
      <Navbar homeRef={homeRef} activeForm={activeForm} setActiveForm={setActiveForm} idUser={idUser} setIdUser={setIdUser} userPrivileges={userPrivileges} setUserPrivileges={setUserPrivileges} prevForm={prevForm} setPrevForm={setPrevForm}/>

      {activeForm === PageForm.LOGIN && (
        <Login activeForm={activeForm} setActiveForm={setActiveForm} idUser={idUser} setIdUser={setIdUser} userPrivileges={userPrivileges} setUserPrivileges={setUserPrivileges} prevForm={prevForm} setPrevForm={setPrevForm}/>
      )}
      {activeForm === PageForm.REGISTER && (
        <Register/>
      )}
      
      {activeForm === PageForm.USER && (
        <User activeForm={activeForm} setActiveForm={setActiveForm} idUser={idUser} setIdUser={setIdUser} userPrivileges={userPrivileges} setUserPrivileges={setUserPrivileges} prevForm={prevForm} setPrevForm={setPrevForm}/>
      )}
      {/*activeForm === PageForm.ADMIN && (
        <Admin/>
      )}*/
      }
      <BookingCalendar maxGuests ={10} setActiveForm={setActiveForm} idUser={idUser} userPrivileges={userPrivileges} prevForm={prevForm} setPrevForm={setPrevForm}
          className={`${activeForm !== PageForm.BOOKING ? 'hidden' : ''}`} 
      />
      {/*
      {activeForm === PageForm.STAFF && (
        <Staff/>
      )}
      */}
      <Home
        activeForm={activeForm}  prevForm={prevForm} userPrivileges={userPrivileges} homeRef={homeRef} 
        className={`${activeForm !== PageForm.HOME ? 'hidden' : ''}`} 
      />
    </>
  )
}
export default App

/*
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


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