import React, { useEffect, useState } from 'react'
import { SupplierModel } from '../models/SupplierModel'
import { message } from 'antd'
import handleAPI from '../apis/handleAPI'

interface Props {
    id: string
}

const SupplierComponent = (props: Props) => {
    const [supplier, setSupplier] = useState<SupplierModel>()

    useEffect(() => {
        getSupplierName()
    },[])

    const getSupplierName = async () => {
        const {id} = props
        try {
            const api = `/supplier/get-supplier-detail?id=${id}`
            const res = await handleAPI(api)
            res.data && setSupplier(res.data)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    return (
        <p>{supplier?.name}</p>
    )
}

export default SupplierComponent
