import React, { useEffect, useState } from 'react'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'
import { addAuth, authSelector, AuthState } from '../redux/authReducer'
import { useDispatch, useSelector } from 'react-redux'
import { localDataNames } from '../constants/appInfos'

const Routers = () => {
  const auth: AuthState = useSelector(authSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  },[])

  const getData = async () => {
    const res = localStorage.getItem(localDataNames.authData)
    res && dispatch(addAuth(JSON.parse(res)))
  }

  return !auth.token ? <AuthRouter/> : <MainRouter/>
}

export default Routers
