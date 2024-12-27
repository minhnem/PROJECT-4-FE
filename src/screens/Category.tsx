import { Button, Card, Form, Input, message, Space, Table, TreeSelect, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import handleAPI from '../apis/handleAPI'
import { CategoryModel } from '../models/CategoryModel'
import { ColumnProps } from 'antd/es/table'
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const {Title} = Typography

const Category = () => {

    const [categories, setCategories] = useState<CategoryModel[]>([])
    const [categorySelected, setCategorySelected] = useState<CategoryModel>()
    const [treeValues, setTreeValues] = useState<CategoryModel[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(10)
    
    const [form] = useForm()

    const columns: ColumnProps<CategoryModel>[] = [
        {
            key: 'title',
            dataIndex: 'title',
            title: 'Tên danh mục'
        },
        {
            key: 'description',
            dataIndex: 'description',
            title: 'Mô tả'
        },
        {
            key: 'action',
            title: 'Lựa chọn',
            align: 'center',
            width: 50,
            fixed: 'right',
            render: (category: CategoryModel) => <Space>
                <Button 
                    type='link'
                    color='default'
                    icon={<MdEditSquare size={20} className='text-blue-500' />}
                    onClick={() => 
                        setCategorySelected(category)
                    }
                />
                <Button 
                    type='link'
                    color='default'
                    icon={<MdDeleteForever size={20} className='text-red-500' />}
                    onClick={() => 
                        handleDeleteCategory(category._id)
                    }
                />
            </Space>
        }
    ]

    useEffect(() => {
        getCategories()
    },[])

    const getCategories = async () => {
        const api = `/product?page=${page}&pageSize=${pageSize}`
        try {
            const res = await handleAPI(api)
            if (res.data) {
                setCategories(res.data.categories)
                setTotal(res.data.total)
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    const handleAddCategory = async (values: any) => {
        console.log(values);

    }

    const handleUpdateCategory = async () => {

    }

    const handleDeleteCategory = async (id: string) => {
        const api = `/product/delete-category?id=${id}`
        try {
            await handleAPI(api, undefined, 'delete')
            message.success('Xóa danh mục thành công.')
            setCategories(categories.filter((element => element._id !== id)))
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    return (
        <div>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-4'>
                    <Card title='Thêm mới danh mục'>
                        <Form
                            onFinish={handleAddCategory}
                            form={form}
                            layout='vertical'
                            size='large'>
                            <FormItem name='parentId' label='Chọn danh mục'>
                                <TreeSelect treeData={[]} allowClear treeDefaultExpandAll placeholder='Chọn danh mục' />
                            </FormItem>
                            <FormItem name='title' label='Tên danh mục' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục.' }]}>
                                <Input allowClear placeholder='Nhập tên danh mục'/>
                            </FormItem>
                            <FormItem name='description' label='Mô tả'>
                                <Input.TextArea cols={4} allowClear />
                            </FormItem>
                            <div className='flex justify-end'>
                                <Button type='primary' onClick={() => form.submit()}>Thêm mới</Button>
                            </div>
                        </Form>
                    </Card>
                </div>

                <div className='col-span-8'>
                    <Table 
                        bordered
                        columns={columns}
                        dataSource={categories}
                        pagination={{
                            showSizeChanger: true,
                            onShowSizeChange(current, size) {
                                setPageSize(size)
                            },
                            total,
                            onChange(page, pageSize) {
                                setPage(page)
                            },
                        }}
                        title={() => (
                            <div>
                                <Title style={{margin: '0'}} level={5}>Bảng danh mục</Title>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default Category
