import axiosClient from "./axiosClinet"

const handleAPI = async (url: string, data?: object, method?: "post" | "push" | "get" | "delete" ) => {
    return await axiosClient(url, {method: method ?? "get", data})
}

export default handleAPI