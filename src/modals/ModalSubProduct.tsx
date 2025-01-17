import { ColorPicker, Form, Input, InputNumber, message, Modal, Upload, UploadProps } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { uploadFile } from '../utils/uploadFile';
import { ProductModel, SubProductModel } from '../models/ProductModel';
import handleAPI from '../apis/handleAPI';

interface Props {
    visible: boolean,
    onClose: () => void,
    product?: ProductModel,
    onAddNew: (val: SubProductModel) => void 
}

const ModalSubProduct = (props: Props) => {

    const { visible, onClose, product, onAddNew } = props

    const [isLoading, setIsLoading] = useState(false)
    const [fileList, setFileList] = useState<any[]>([])

    const [form] = useForm()

    const handleClose = () => {
        setFileList([])
        form.resetFields()
        onClose()
    }

    const handleChangeUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const items = newFileList.map((file) => file.originFileObj
            ? { ...file, url: file.originFileObj && URL.createObjectURL(file.originFileObj), status: 'done' } 
            : {...file})
        setFileList(items)
    }

    const handleAddSubProduct = async (values: any) => {
        setIsLoading(true)
        const data: any = {}
        for(const i in values) {
            data[i] = values[i] ?? ''
        }
        data.color = values.color.toHexString()
        if(fileList.length > 0) {
            const urls: string[] = []
            for(const file of fileList) {
                const url = await uploadFile(file.originFileObj)
                urls.push(url)
            }
            data.images = urls
        }
        data.productId = product?._id
        try {
            const api = '/product/add-sub-product'
            const res: any = await handleAPI(api, data, 'post')
            message.success(res.message)
            onAddNew(res.data)
            setFileList([])
            form.resetFields()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            closable={!isLoading}
            open={visible}
            title={`Thêm biến thể cho sản phẩm: ${product?.title}`}
            okText='Thêm'
            cancelText='Hủy'
            onClose={handleClose}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <Form
                disabled={isLoading}
                form={form}
                onFinish={handleAddSubProduct}
                layout='vertical'
                size='large'
            >
                <div className='mb-5'>
                    <span className='block my-3'>Tải ảnh biến thể sản phẩm:</span>
                    <div className='flex justify-center'>
                        <Upload
                            listType='picture-card'
                            fileList={fileList}
                            onChange={handleChangeUpload}
                        >
                            <FaPlus style={{ marginRight: '5px' }} />
                            Tải lên
                        </Upload>
                    </div>
                </div>
                <FormItem name='color' label='Chọn màu sắc:'>
                    <ColorPicker format='hex' />
                </FormItem>
                <FormItem name='size' label='Nhập kích cỡ:' rules={[{ required: true, message: 'Vui lòng nhập kích cỡ cho sản phẩm.' }]}>
                    <Input allowClear />
                </FormItem>
                <div className='grid grid-cols-2 gap-5'>
                    <FormItem name='qty' label='Nhập số lượng:' rules={[{ required: true, message: 'Vui lòng nhập số lượng.' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </FormItem>
                    <FormItem name='price' label='Nhập giá bán:' rules={[{ required: true, message: 'Vui lòng nhập giá.' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </FormItem>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalSubProduct
