import axios from "axios"

export const uploadFile = async (file: any) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET as string)

    const api = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLUOD_NAME}/image/upload`

    const res = await axios.post(api, data) 
    return res.data.secure_url
}