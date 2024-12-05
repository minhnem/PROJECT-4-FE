import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, refreshToken, removeAuth } from '../redux/authReducer'
import handleAPI from '../apis/handleAPI'

const HomeScreen = () => {
    const dispatch = useDispatch()
    const auth = useSelector(authSelector)

    const handleLogout = () => {
        dispatch(removeAuth({}))
    }

    // const getProducts = async () => {
    //     try {
    //         const res = await handleAPI("/storege/products")
    //         console.log(res);
            
    //     } catch (error: any) {
    //         console.log(error);
    //         if(error.error === "jwt expired"){
    //             handleRefreshtoken()
    //         }
    //     }
    // }

    // const handleRefreshtoken = async () => {
    //     try {
    //         const res = await handleAPI(`/auth/refresh-token?id=${auth._id}`)
    //         dispatch(refreshToken(res.data.token))
    //         getProducts()
    //     } catch (error: any) {
    //         console.log(error);
    //     }
    // }

    return (
        <div>
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default HomeScreen
