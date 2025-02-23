import { Avatar, Button, message, Modal, Space, Table, Typography } from 'antd'
import { ColumnProps } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductModel, SubProductModel } from '../../models/ProductModel'
import handleAPI from '../../apis/handleAPI'
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { VND } from '../../utils/handleCurrency'
import ModalSubProduct from '../../modals/ModalSubProduct'
import { AiOutlineArrowLeft } from "react-icons/ai";

const { Title } = Typography
const { confirm } = Modal

const ProductDetail = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [subProduct, setSubProduct] = useState<SubProductModel[]>()
  const [visibleModalSubProduct, setVisibleModalSubProduct] = useState(false)
  const [subProductSelected, setSubProductSelected] = useState<SubProductModel>()
  const [product, setProduct] = useState<ProductModel>()

  const [serchParams] = useSearchParams()
  const id = serchParams.get('id')

  const columns: ColumnProps<SubProductModel>[] = [
    {
      key: 'image',
      title: 'Ảnh biến thể',
      dataIndex: 'images',
      render: (images: string[]) => <Space>
        {images.map((image: string) => (<Avatar size={50} src={image} style={{ border: '1px solid black' }} />))}
      </Space>
    },
    {
      key: 'color',
      title: 'Màu sắc',
      dataIndex: 'color',
      render: (color: string) => <Space>
        <div
          style={{
            background: `${color}`,
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid #534646'
          }}></div>
      </Space>
    },
    {
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => VND.format(price)
    },
    {
      key: 'qty',
      title: 'Số lượng',
      dataIndex: 'qty'
    },
    {
      key: 'discount',
      title: 'Giảm giá',
      dataIndex: 'discount',
      render: (discount: number) => discount ? `${discount} %` : ''
    },
    {
      key: 'action',
      fixed: true,
      align: 'center',
      width: 150,
      title: 'Lựa chọn',
      render: (subProduct: SubProductModel) => <Space>
        <Button
          type='link'
          icon={<MdEditSquare size={20} className='text-blue-500' />}
          onClick={() => {
            setVisibleModalSubProduct(true)
            setSubProductSelected(subProduct)
          }}
        />
        <Button
          type='link'
          icon={<MdDeleteForever size={20} className='text-red-500' />}
          onClick={() => {
            confirm({
              title: 'Xác nhận',
              content: 'Bạn có chắc muốn xóa biến thể này không ?',
              onOk: () => {
                deleteSubProduct(subProduct._id)
              }
            })
          }}
        />
      </Space>
    }
  ]

  useEffect(() => {
    getSubProduct()
    getProduct()
  }, [])

  const getProduct = async () => {
    try {
      setIsLoading(false)
      const api = `/product/get-product-detail?id=${id}`
      const res = await handleAPI(api)
      console.log(res.data)
      res.data && setProduct(res.data)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getSubProduct = async () => {
    try {
      setIsLoading(false)
      const api = `/product/get-sub-product-detail?id=${id}`
      const res = await handleAPI(api)
      console.log(res.data)
      res.data && setSubProduct(res.data)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSubProduct = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/product/delete-sub-product?id=${id}`
      const res: any = await handleAPI(api, undefined, 'delete')
      setSubProduct(subProduct?.filter((element) => element._id !== id))
      message.success(res.message)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={subProduct}
        loading={isLoading}
        bordered
        title={() => (
          <div className='grid grid-cols-2'>
            <div>
              <Title level={2}>{product?.title}</Title>
            </div>
            <div className='flex items-center justify-end'>
              <Link
                to={'/inventory'}
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#1677ff'
                }}
              >
                <AiOutlineArrowLeft size={20} /> 
                Kho hàng
              </Link>
            </div>
          </div>
        )}
      />

      <ModalSubProduct
        visible={visibleModalSubProduct}
        onClose={() => { setVisibleModalSubProduct(false) }}
        onAddNew={() => { getSubProduct() }}
        subProduct={subProductSelected}
      />
    </div>
  )
}

export default ProductDetail
