import { Button, Card, Divider, Form, Input, message, Select, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import { ModalCategoty } from '../../modals'
import { SupplierModel, SupplierOption } from '../../models/SupplierModel'
import { TreeData } from '../../models/CategoryModel'
import handleAPI from '../../apis/handleAPI'
import { replaceName } from '../../utils/repalceName'
import { getTreevalues } from '../../utils/getTreevalues'

const { Title } = Typography

const AddProduct = () => {
    const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false)
    const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([])
    const [categories, setCategories] = useState<TreeData[]>([])

    const [form] = Form.useForm()

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            await getSuppliers()
            await getCategories()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    const getSuppliers = async () => {
        const api = '/supplier'
        const res = await handleAPI(api)
        const items = res.data.suppliers.map((item: SupplierModel) => ({ label: item.name, value: item._id }))
        setSupplierOptions(items)
    }

    const getCategories = async () => {
        const api = '/product'
        const res = await handleAPI(api)
        const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
        setCategories(datas)
    }

    const handleAddProduct = async (values: any) => {
        console.log(values);
    }

    return (
        <div>
            <Title level={4}>Add New Product</Title>
            <Form form={form} size='large' layout='vertical' onFinish={handleAddProduct}>
                <div className='grid grid-cols-12 gap-10'>
                    <div className='col-span-8'>
                        <FormItem name='title' label='Tên sản phẩm' rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm.' }]}>
                            <Input placeholder='Nhập tên sản phẩm' allowClear maxLength={150} showCount />
                        </FormItem>
                        <FormItem name='description' label='Mô tả sản phẩm'>
                            <Input.TextArea maxLength={1000} showCount allowClear />
                        </FormItem>
                    </div>
                    <div className='col-span-4' >
                        <Card className='mt-5' title='Category'>
                            <FormItem name='category' rules={[{ required: true, message: 'Vui lòng chọn danh mục.' }]}>
                                <Select
                                    options={[]}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider className='mb-1' />
                                            <Button
                                                className='my-2'
                                                onClick={() => setIsVisibleModalCategory(true)}
                                            >
                                                Thêm mới
                                            </Button>
                                        </>
                                    )}
                                />
                            </FormItem>
                        </Card>

                        <Card className='mt-5' title='Supplier'>
                            <FormItem name='supplier' rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp.' }]}>
                                <Select
                                    showSearch
                                    options={supplierOptions}
                                    optionFilterProp='label'
                                    filterOption={(input, option) => replaceName(option?.label ? option.label : '').includes(replaceName(input))} />
                            </FormItem>
                        </Card>

                        <Card className='mt-5'>
                            <Button type='primary' onClick={() => form.submit()}>submit</Button>
                        </Card>
                    </div>
                </div>

                <ModalCategoty
                    visible={isVisibleModalCategory}
                    onClose={() => setIsVisibleModalCategory(false)}
                    values={categories}
                    onAddNew={async () => await getCategories()} 
                />

            </Form>
        </div>
    )
}

export default AddProduct
