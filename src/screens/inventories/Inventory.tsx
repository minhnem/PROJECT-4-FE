import { Avatar, Button, Dropdown, Input, message, Modal, Space, Table, Tag, Tooltip, Typography } from 'antd'
import { ColumnProps, TableProps } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import handleAPI from '../../apis/handleAPI'
import { Link, useNavigate } from 'react-router-dom'
import { CategoryComponent, FilterProduct, SupplierComponent } from '../../components'
import { ProductModel, SubProductModel } from '../../models/ProductModel'
import { MdLibraryAdd } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import ModalSubProduct from '../../modals/ModalSubProduct'
import { FiFilter } from 'react-icons/fi'
import { replaceName } from '../../utils/repalceName'

const { Title } = Typography
const { confirm } = Modal

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const Inventory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ProductModel[]>([])
  const [productsFilter, setProductsFilter] = useState<ProductModel[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [visibleSubProductModel, setVisibleSubProductModel] = useState(false)
  const [productSelected, setProductSelected] = useState<ProductModel>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')

  const navigate = useNavigate()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<ProductModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: 'title',
      dataIndex: '',
      title: 'Tên sản phẩm',
      width: 300,
      render: (item: ProductModel) => <Link className='text-[#1677ff]' to={`/inventory/product-detail?id=${item._id}`}>{item.title}</Link>
    },
    {
      key: 'images',
      dataIndex: 'images',
      title: 'Hình ảnh',
      width: 300,
      render: (imgs: string[]) => imgs.length > 0 && (
        <Space>
          {imgs.map((url, index) => (<Avatar key={index} src={url} size={50} style={{ border: '1px solid black' }} />))}
        </Space>
      )
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Mô tả',
      width: 350,
      render: (desc: string) => <Tooltip style={{width: '320px'}} title={desc}>
        <div className='text-clamp'>
          {desc}
        </div> 
      </Tooltip>
    },
    {
      key: 'categories',
      dataIndex: 'categories',
      title: 'Danh mục',
      width: 300,
      render: (ids: string[]) => ids.length > 0 && (
        <Space>
          {ids.map((id, index) => (<CategoryComponent id={id} key={index} />))}
        </Space>
      )
    },
    {
      key: 'supplier',
      dataIndex: 'supplier',
      title: 'Nhà cung cấp',
      width: 300,
      render: (id) => id && (
        <SupplierComponent id={id} />
      )
    },
    {
      key: 'color',
      dataIndex: 'subProduct',
      title: 'Màu sắc',
      width: 250,
      render: (item: SubProductModel[]) => (
        <Space>
          {item.map((element) => (
            <div
              key={element._id}
              style={{
                background: `${element.color}`,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid #534646'
              }}></div>
          ))}
        </Space>
      )
    },
    {
      key: 'size',
      dataIndex: 'subProduct',
      title: 'Kích cỡ',
      width: 250,
      render: (item: SubProductModel[]) => (
        <Space>
          {item.map((element) => (
            <Tag className='font-bold'>{element.size}</Tag>
          ))}
        </Space>
      )
    },
    {
      key: 'price',
      dataIndex: 'subProduct',
      title: 'Giá bán',
      width: 250,
      render: (item: SubProductModel[]) => {
        const nums: number[] = []
        item.forEach(element => nums.push(element.price))
        return nums.length > 0 ? `${Math.min(...nums).toLocaleString()} đ - ${Math.max(...nums).toLocaleString()} đ` : ''
      }
    },
    {
      key: 'stock',
      dataIndex: 'subProduct',
      title: 'Số lượng tồn kho',
      width: 150,
      render: (item: SubProductModel[]) => {
        const total = item.reduce((a, b) => a + b.qty, 0)
        return total
      }
    },
    {
      key: 'action',
      title: 'Lựa chọn',
      align: 'center',
      fixed: 'right',
      dataIndex: '',
      width: 150,
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
          onClick={() => {
            navigate(`/inventory/add-new-product?id=${product._id}`)
          }}
        />
        <Button
          type='link'
          icon={<MdDeleteForever size={20} className='text-red-500' />}
          onClick={() => {
            confirm({
              title: 'Xác nhận',
              content: 'Bạn có chắc muốn xóa sản phẩm này không ?',
              onOk: () => {
                deleteProduct(product._id)
              }
            })
          }}
        />
      </Space>
    }
  ]

  useEffect(() => {
    if(!searchKey) {
      getProducts()
    }
  }, [searchKey])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const api = `/product?page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setProducts(res.data.products.map((item: ProductModel) => ({ ...item, key: item._id })))
        setTotal(res.data.total)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/product/delete-product?id=${id}`
      await handleAPI(api, undefined, 'delete')
      message.success('Xóa sản phẩm thành công')
      setProducts(products.filter(item => item._id !== id))
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const hanleSearchProduct = async () => {
    const title = replaceName(searchKey)
    try {
      setIsLoading(true)
      const api = `/product?title=${title}&page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if(res.data) {
        setProducts(res.data.products.map((item: ProductModel) => ({...item, key: item._id})))
        setTotal(res.data.title)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterProduct = async (values: any) => {
    console.log(values)
    try {
      setIsLoading(true)
      const api = '/product/filter-product'
      const res: any = await handleAPI(api, values, 'post')
      message.success(res.message)
      setProductsFilter(res.data.items)
      setTotal(res.data.total)
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
        rowSelection={rowSelection}
        loading={isLoading}
        dataSource={productsFilter.length > 0 ? productsFilter : products}
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
              <Space>
                {
                  selectedRowKeys.length > 0 ? (
                    <div>
                      <span className='text-red-500 font-bold mr-3'>{selectedRowKeys.length} sản phẩm được chọn</span>
                      <Button
                        type='primary'
                        danger
                        onClick={() => {
                          confirm({
                            title: 'Xác nhận',
                            content: 'Bạn có chắc muốn xóa những sản phẩm được chọn không ?',
                            onOk: () => {
                              selectedRowKeys.forEach((id: string) => deleteProduct(id))
                            }
                          })
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : ''
                }
                <Input.Search
                  value={searchKey}
                  onChange={(val) => setSearchKey(val.target.value)}
                  onSearch={hanleSearchProduct}
                  placeholder='Nhập tên sản phẩm'
                  allowClear 
                />
                <Dropdown dropdownRender={(menu) => <FilterProduct value={{}} onFilter={(val) => handleFilterProduct(val)}/>}>
                  <Button icon={<FiFilter />}>Lọc</Button>
                </Dropdown>
                {productsFilter.length > 0 ? <Button danger onClick={() => setProductsFilter([])}>
                  Hủy lọc
                </Button> : ''}
                <Button type='primary'>
                  <Link to='/inventory/add-new-product'>Thêm mới</Link>
                </Button>
              </Space>
            </div>
          </div>
        )}
      />

      <ModalSubProduct
        visible={visibleSubProductModel}
        onClose={() => { setVisibleSubProductModel(false) }}
        product={productSelected}
        onAddNew={() => getProducts()}
      />
    </div>
  )
}

export default Inventory

