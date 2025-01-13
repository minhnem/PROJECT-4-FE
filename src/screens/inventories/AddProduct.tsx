import { Button, Card, Divider, Form, Image, Input, message, Select, TreeSelect, Typography, UploadFile } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import { ModalCategoty } from '../../modals'
import { SupplierModel, SupplierOption } from '../../models/SupplierModel'
import { TreeData } from '../../models/CategoryModel'
import handleAPI from '../../apis/handleAPI'
import { replaceName } from '../../utils/repalceName'
import { getTreevalues } from '../../utils/getTreevalues'
import Upload, { UploadProps } from 'antd/es/upload'
import { FaPlus } from "react-icons/fa6";
import { uploadFile } from '../../utils/uploadFile'

const { Title, Text } = Typography

const AddProduct = () => {
    const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false)
    const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([])
    const [categories, setCategories] = useState<TreeData[]>([])
    const [fileList, setFileList] = useState<any[]>([])
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewIamge] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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
        const api = '/product/get-categories'
        const res = await handleAPI(api)
        const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
        setCategories(datas)
    }

    const handleChangeUpLoad: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const items = newFileList.map((file) => ({ ...file, url: file.originFileObj && URL.createObjectURL(file.originFileObj), status: 'done' }))
        setFileList(items)
    }

    const handleAddProduct = async (values: any) => {
        setIsLoading(true)
        const data: any = {}
        for (const i in values) {
            data[i] = values[i] ?? ''
        }
        data.slug = replaceName(values.title)
        if (fileList.length > 0) {
            const urls: string[] = []
            for(const file of fileList) {
                const url = await uploadFile(file.originFileObj)
                urls.push(url)
            }
            data.images = urls
        }
        try {
            const api = '/product/add-new-product'
            const res: any = await handleAPI(api, data, 'post')
            message.success(res.message)
            console.log(res.data)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
            form.resetFields()
        }

    }

    return (
        <div>
            <Title level={4}>Add New Product</Title>
            <Form form={form} size='large' layout='vertical' onFinish={handleAddProduct} disabled={isLoading}>
                <div className='grid grid-cols-12 gap-10'>
                    <div className='col-span-8'>
                            <Card title='Chọn ảnh sản phẩm'>
                                <Upload
                                    listType='picture-card'
                                    fileList={fileList}
                                    onChange={handleChangeUpLoad}
                                >
                                    <FaPlus style={{ marginRight: '5px' }} />
                                    Tải lên
                                </Upload>
                            </Card>
                            {
                                previewImage && (
                                    <Image
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewIamge('')
                                        }}
                                        src={previewImage}

                                    />
                                )
                            }
                        <FormItem name='title' label='Tên sản phẩm:' rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm.' }]}>
                            <Input placeholder='Nhập tên sản phẩm' allowClear maxLength={150} showCount />
                        </FormItem>
                        <FormItem name='description' label='Mô tả sản phẩm:'>
                            <Input.TextArea maxLength={1000} showCount allowClear />
                        </FormItem>
                    </div>
                    <div className='col-span-4' >
                        <Card title='Danh mục'>
                            <FormItem name='categories' rules={[{ required: true, message: 'Vui lòng chọn danh mục.' }]}>
                                <TreeSelect
                                    treeData={categories}
                                    multiple
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

                        <Card className='mt-5' title='Nhà cung cấp'>
                            <FormItem name='supplier' rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp.' }]}>
                                <Select
                                    showSearch
                                    options={supplierOptions}
                                    optionFilterProp='label'
                                    filterOption={(input, option) => replaceName(option?.label ? option.label : '').includes(replaceName(input))} />
                            </FormItem>
                        </Card>

                        <Card className='mt-5'>
                            <Button loading={isLoading} type='primary' onClick={() => form.submit()}>submit</Button>
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
