import React from 'react'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../redux/authReducer'

const HomeScreen = () => {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(removeAuth({}))
    }

    return (
        <div>
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default HomeScreen
