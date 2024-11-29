import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../screens/auth/Login'
import Register from '../screens/auth/Register'

const AuthRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Register/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AuthRouter
