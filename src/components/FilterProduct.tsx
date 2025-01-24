import { Button, Card, Form, message, Select, Slider, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import handleAPI from '../apis/handleAPI'
import { Categories, CategoryModel } from '../models/CategoryModel'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { SelectModel } from '../models/ProductModel'

export interface FilterProductValue {
  color?: string,
  categories?: string[],
  size?: string,
  price?: number[],
}

interface Props {
  value: FilterProductValue,
  onFilter: (val: FilterProductValue) => void
}

const FilterProduct = (props: Props) => {

  const { onFilter } = props

  const [isLoading, setIsLoading] = useState(false)
  const [selectData, setSelectData] = useState<{
    categories: Categories[]
    colors: SelectModel[]
    sizes: SelectModel[]
    price: number[]
  }>(
    {
      categories: [],
      colors: [],
      sizes: [],
      price: []
    }
  )

  const [form] = useForm()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      setIsLoading(true)
      await getCategories()
      await getSubProducts()
    } catch (error: any) {
      message.error(error.messase)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategories = async () => {
    const api = '/product/get-all-categories'
    const res = await handleAPI(api)
    const data = res.data && res.data.map((item: CategoryModel) => ({ label: item.title, value: item._id }))
    setSelectData(prev => ({ ...prev, categories: data }))
  }

  const getSubProducts = async () => {
    const api = '/product/get-sub-product'
    const res = await handleAPI(api)
    res.data && setSelectData(prev => ({ ...prev, colors: res.data.colors, sizes: res.data.sizes, price: res.data.price }))
  }

  const handleFilter = (values: any) => {
    onFilter(values)
  }

  return (
    <Card className='filter-cart' style={{ width: '400px' }}>
      {isLoading ? <Spin /> : <>
        <Form
          size='large'
          layout='vertical'
          onFinish={handleFilter}
          form={form}
        >
          <FormItem label='Danh mục:' name='categories'>
            <Select options={selectData.categories} allowClear mode='multiple' placeholder='Danh mục' />
          </FormItem>
          <div className='grid grid-cols-2 gap-3'>
            <FormItem label='Màu sắc:' name='color'>
              <Select allowClear placeholder='Màu sắc'>
                {
                  selectData.colors.map((color: SelectModel, index: number) => (
                    <Select.Option value={color.value} key={index}>
                      <span className='px-[10px] rounded-full' style={{ backgroundColor: `${color.label}` }}>
                        {color.label}
                      </span>
                    </Select.Option>
                  ))
                }
              </Select>
            </FormItem>
            <FormItem label='Kích cỡ:' name='size'>
              <Select options={selectData.sizes} allowClear placeholder='Kích cỡ' />
            </FormItem>
          </div>
          <FormItem label='Giá:' name='price'>
            <Slider range min={selectData.price[0]} max={selectData.price[1]} />
          </FormItem>
        </Form>
        <div className='text-right'>
          <Button type='primary' onClick={() => form.submit()}>Lọc</Button>
        </div>
      </>}
    </Card>
  )
}

export default FilterProduct
