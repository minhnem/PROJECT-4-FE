import { Button, message, Modal, Space, Typography } from 'antd'
import Table, { ColumnProps } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { FiFilter } from "react-icons/fi";
import { ToogleSupplier } from '../modals';
import { SupplierModel } from '../models/SupplierModel';
import handleAPI from '../apis/handleAPI';
import { MdEditSquare } from "react-icons/md";
import { RiUserForbidFill } from "react-icons/ri";

const { Title, Text } = Typography
const { confirm } = Modal

const Suppliers = () => {

  const [isVisibleModelAddNew, setIsVisibleModelAddNew] = useState(false)
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([])
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getSuppliers()
  }, [])

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Supplier name'
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Product'
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email'
    },
    {
      key: 'contact',
      dataIndex: 'contact',
      title: 'Contact'
    },
    {
      key: 'taking',
      dataIndex: 'isTaking',
      title: 'Type',
      render: (isTaking: boolean) => <Text type={isTaking ? 'success' : 'danger'}>{isTaking ? 'Taking': 'Not Taking'}</Text>
    },
    {
      key: 'buttonAction',
      dataIndex: '',
      title: 'Action',
      fixed: 'left',
      render: (supplier: SupplierModel) => <Space>
        <Button 
          color='default' 
          variant="outlined" 
          icon={<MdEditSquare size={20} 
          className='text-blue-500'/>}
          onClick={() => { 
            setSupplierSelected(supplier)
            setIsVisibleModelAddNew(true)
          }}
        />
        <Button 
          color='danger' 
          variant='outlined' 
          icon={<RiUserForbidFill 
          size={20} 
          className='text-red-500'/>}
          onClick={() =>
            confirm({
              title: 'ConFirm',
              content: 'Are you sure delete this supplier ?',
              onOk: () => {
                deleteSupplier(supplier._id)
                getSuppliers()
              }
            })
          }/>
      </Space>
    }
  ]

  const getSuppliers = async () => {
    const api = '/supplier?page=1&pageSize=10'
    setIsLoading(true)
    try {
      const res = await handleAPI(api)
      res.data && setSuppliers(res.data)
    } catch (error: any) {
      message.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  const deleteSupplier = async (id: string) => {
    const api = `supplier/delete?id=${id}`
    setIsLoading(true)
    try {
      const res: any = await handleAPI(api, undefined, 'delete')
      message.success(res.message)
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table 
        loading={isLoading}
        dataSource={suppliers}
        columns={columns}
        title={() => (
          <div className='grid grid-rows-1 grid-cols-2'>
            <div>
              <Title level={5}>Suppliers</Title>
            </div>
            <div className='text-end'>
              <Space>
                <Button 
                  type='primary' 
                  onClick={() => {
                    setIsVisibleModelAddNew(true)
                  }}>
                    Add Suppliers
                </Button>
                <Button icon={<FiFilter />}>Filter</Button>
                <Button>Download All</Button>
              </Space>
            </div>
          </div>
        )}
      />

      <ToogleSupplier 
        visible={isVisibleModelAddNew} 
        onClose={() => {
          supplierSelected && getSuppliers()
          setSupplierSelected(undefined)
          setIsVisibleModelAddNew(false)
        }} 
        onAddNew={val => setSuppliers([...suppliers, val])} 
        supplier={supplierSelected} />

    </div>
  )
}

export default Suppliers
