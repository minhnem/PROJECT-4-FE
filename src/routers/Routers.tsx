import React from 'react'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'
import { authSelector, AuthState } from '../redux/authReducer'
import { useDispatch, useSelector } from 'react-redux'

const Routers = () => {

  const auth: AuthState = useSelector(authSelector)
  const dispatch = useDispatch()

  console.log(auth)
  

  return !auth.token ? <AuthRouter/> : <MainRouter/>
}

export default Routers
