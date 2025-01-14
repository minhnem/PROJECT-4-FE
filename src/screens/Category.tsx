import { Button, Card, Form, Input, message, Modal, Space, Table, TreeSelect, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import handleAPI from '../apis/handleAPI'
import { CategoryModel, TreeData } from '../models/CategoryModel'
import { ColumnProps } from 'antd/es/table'
import { MdEditSquare } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { replaceName } from '../utils/repalceName'
import { getTreevalues } from '../utils/getTreevalues'

const { Title } = Typography
const { confirm } = Modal

const Category = () => {

    const [categories, setCategories] = useState<CategoryModel[]>([])
    const [categorySelected, setCategorySelected] = useState<CategoryModel>()
    const [treeValues, setTreeValues] = useState<TreeData[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(10)
    const [isLoading, setIsLoading] = useState(false)

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
            dataIndex: '',
            title: 'Lựa chọn',
            align: 'center',
            width: 100,
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
                        confirm({
                            title: 'Xác nhận',
                            content: 'Bạn có chắc muốn xóa danh mục này ?',
                            onOk: () => {
                                handleDeleteCategory(category._id)
                                getCategories()
                            },
                        })
                    }
                />
            </Space>
        }
    ]

    useEffect(() => {
        if (categorySelected) {
            form.setFieldsValue(categorySelected)
        }
    }, [categorySelected])

    useEffect(() => {
        getCategories()
    }, [page, pageSize])

    useEffect(() => {
        getTreeValueCategory()
    }, [])

    const getCategories = async () => {
        setIsLoading(true)
        const api = `/product/get-categories`
        try {
            const res = await handleAPI(api)
            if (res.data) {
                setCategories(getTreevalues(res.data.categories, true))
                setTotal(res.data.total)
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getTreeValueCategory = async () => {
        const api = '/product/get-categories'
        try {
            const res = await handleAPI(api)
            const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
            setTreeValues(datas)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    const handleAddCategory = async (values: any) => {
        setIsLoading(true)
        const datas: any = {}
        for (const i in values) {
            datas[i] = values[i] ?? ''
        }
        datas.slug = replaceName(values.title)
        const api = '/product/add-new-category'
        try {
            const res: any = await handleAPI(api, datas, 'post')
            message.success(res.message)
            form.resetFields()
            getCategories()
            getTreeValueCategory()
        } catch (error: any) {
            message.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateCategory = async (values: any) => {
        setIsLoading(true)
        const datas: any = {}
        for (const i in values) {
            datas[i] = values[i] ?? ''
        }
        datas.slug = replaceName(values.title)
        const api = `/product/update-category?id=${categorySelected?._id}`
        try {
            const res: any = await handleAPI(api, datas, 'put')
            message.success(res.message)
            form.resetFields()
            setCategorySelected(undefined)
            getCategories()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCategory = async (id: string) => {
        setIsLoading(true)
        const api = `/product/delete-category?id=${id}`
        try {
            await handleAPI(api, undefined, 'delete')
            message.success('Xóa danh mục thành công.')
            setCategories(categories.filter((element) => element._id !== id))
            getTreeValueCategory()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-4'>
                    <Card title={categorySelected ? 'Sửa danh mục' : 'Thêm mới danh mục'}>
                        <Form
                            onFinish={categorySelected ? handleUpdateCategory : handleAddCategory}
                            form={form}
                            layout='vertical'
                            size='large'>
                            <FormItem name='parentId' label='Chọn danh mục'>
                                <TreeSelect treeData={treeValues} allowClear treeDefaultExpandAll placeholder='Chọn danh mục' />
                            </FormItem>
                            <FormItem name='title' label='Tên danh mục' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục.' }]}>
                                <Input allowClear placeholder='Nhập tên danh mục' />
                            </FormItem>
                            <FormItem name='description' label='Mô tả'>
                                <Input.TextArea cols={4} allowClear />
                            </FormItem>
                            <div className='flex justify-end'>
                                <Space>
                                    <Button onClick={() => {
                                        setCategorySelected(undefined)
                                        form.resetFields()
                                    }}
                                    >
                                        Làm mới
                                    </Button>
                                    <Button
                                        loading={isLoading}
                                        type='primary'
                                        disabled={categorySelected ? false : true}
                                        onClick={() => form.submit()}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        loading={isLoading}
                                        type='primary'
                                        disabled={categorySelected ? true : false}
                                        onClick={() => form.submit()}
                                    >
                                        Thêm mới
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </div>

                <div className='col-span-8'>
                    <Table
                        loading={isLoading}
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
                        scroll={{
                            y: 'calc(100vh - 300px)'
                        }}
                        title={() => (
                            <div>
                                <Title style={{ margin: '0' }} level={5}>Bảng danh mục</Title>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default Category
