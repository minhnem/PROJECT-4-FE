import { Avatar, Button, message, Space, Table, Tooltip, Typography } from 'antd'
import { ColumnProps } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import handleAPI from '../../apis/handleAPI'
import { Link } from 'react-router-dom'
import { CategoryComponent, SupplierComponent } from '../../components'
import { ProductModel } from '../../models/ProductModel'
import { MdLibraryAdd } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import ModalSubProduct from '../../modals/ModalSubProduct'

const { Title } = Typography

const Inventory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ProductModel[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [visibleSubProductModel, setVisibleSubProductModel] = useState(false)
  const [productSelected, setProductSelected] = useState<ProductModel>()

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tên sản phẩm'
    },
    {
      key: 'images',
      dataIndex: 'images',
      title: 'Hình ảnh',
      render: (imgs: string[]) => imgs.length > 0 && (
        <Space>
          <Avatar.Group>
            {imgs.map((url) => (<Avatar src={url} size={40} />))}
          </Avatar.Group>
        </Space>
      )
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Mô tả'
    },
    {
      key: 'categories',
      dataIndex: 'categories',
      title: 'Danh mục',
      render: (ids: string[]) => ids.length > 0 && (
        <Space>
          {ids.map((id) => (<CategoryComponent id={id} />))}
        </Space>
      )
    },
    {
      key: 'supplier',
      dataIndex: 'supplier',
      title: 'Nhà cung cấp',
      render: (id) => id && (
        <SupplierComponent id={id} />
      )
    },
    {
      key: 'action',
      title: 'Lựa chọn',
      align: 'center',
      fixed: 'right',
      dataIndex: '',
      render: (product: ProductModel) => <Space>
        <Tooltip title='Thêm biến thể'>
          <Button 
          type='primary' 
          icon={<MdLibraryAdd size={20} />}
          onClick={() => {
            setProductSelected(product)
            setVisibleSubProductModel(true)
          }}
          />
        </Tooltip>
        <Button
          type='link'
          icon={<MdEditSquare size={20} className='text-blue-500' />}
        />
        <Button
          type='link'
          icon={<MdDeleteForever size={20} className='text-red-500' />}
        />
      </Space>
    }
  ]

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const api = `/product?page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setProducts(res.data.products)
        setTotal(res.data.total)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={products}
        bordered
        columns={columns}
        pagination={{
          showSizeChanger: true,
          onChange(page, pageSize) {
            setPage(page)
          },
          onShowSizeChange(current, size) {
            setPageSize(size)
          },
          total,
        }}
        scroll={{
          x: '100%'
        }}
        title={() => (
          <div className='grid grid-cols-2'>
            <div>
              <Title level={4}>Bảng sản phẩm</Title>
            </div>
            <div className='text-right'>
              <Button type='primary'>
                <Link to='/inventory/add-new-product'>Thêm mới</Link>
              </Button>
            </div>
          </div>
        )}
      />

      <ModalSubProduct
        visible={visibleSubProductModel}
        onClose={() => { setVisibleSubProductModel(false) }}
        product={productSelected}
      />
    </div>
  )
}

export default Inventory

