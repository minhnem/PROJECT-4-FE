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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(10)

  useEffect(() => {
    getSuppliers()
  }, [page, pageSize])

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center'
    },
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
      fixed: 'right',
      align: 'center',
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
    const api = `/supplier?page=${page}&pageSize=${pageSize}`
    setIsLoading(true)
    try {
      const res = await handleAPI(api)
      //res.data.suppliers && setSuppliers(res.data.suppliers)
      const items: SupplierModel[] = []
      res.data.suppliers.forEach((item: any, index: number) => {
        items.push({
          index: ((page - 1) * pageSize) + (index + 1),
          ...item,
        })
      })
      setSuppliers(items)
      setTotal(res.data.total)
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
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size)
          },
          total,
          onChange: (page, pageSize) => {
            setPage(page)
          },
        }}
        scroll={{
          y: 'calc(100vh - 300px)'
        }}
        bordered
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
