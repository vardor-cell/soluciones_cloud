import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login';
import { GlobalProvider } from './GlobalContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './TaskList'
import CreateUser from './CreateUser'

function App() {

  return (
    <>
  <GlobalProvider>
        <Router>
            <Routes>
                <Route exact path="/" element={<Login  />} />
                <Route exact path="/tasklist" element={<TaskList  />} />
                <Route exact path="/createuser" element={<CreateUser  />} />
            </Routes>
        </ Router>
    </GlobalProvider>
    </>
  );
}

export default App
