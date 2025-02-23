import { DatePicker, Form, Input, message, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import handleAPI from '../apis/handleAPI'
import { PromotionModel } from '../models/PromotionModel'
import dayjs from 'dayjs'

interface Props {
    visible: boolean,
    onClose: () => void,
    onAddNew: (val: PromotionModel) => void
    promotion?: PromotionModel
}

const AddPromotion = (props: Props) => {
    const {visible, onClose, onAddNew, promotion} = props

    const [isLoading, setIsLoading] = useState(false)

    const [form] = useForm()

    useEffect(() => {
        if(promotion) {
            form.setFieldsValue({...promotion, startAt: dayjs(promotion.startAt), endAt: dayjs(promotion.endAt)})
        }
    }, [promotion]);

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    const handleAddPromotion = async (values: any) => {
        console.log(values)
        const startAt = values.startAt
        const endAt  = values.endAt
        if (new Date(endAt).getTime() < new Date(startAt).getTime()) {
            message.error('Thời gian bắt đầu phải lớn hơn thời gian kết thúc!!')
        } else {
            const data: any = {}
            for(const i in values) {
                data[i] = values[i] ?? ''
            }
            data.startAt = new Date(startAt)
            data.endAt = new Date(endAt)
            try {
                setIsLoading(true)
                const api = `/promotion/${promotion ? `update-promotion?id=${promotion._id}` : `add-promotion`}`
                const res: any = await handleAPI(api, data, `${promotion ? 'put' : 'post'}`)
                if(res.data) {
                    message.success(res.message)
                    onAddNew(res.data)
                    handleClose()
                } 
            } catch (error: any) {
                message.error(error.message)
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Modal
            open={ visible }
            title={promotion ? 'Sửa thông tin mã khuyến mại/giảm giá' : `Tạo mã khuyến mại/giảm giá`}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <Form
                form={form}
                layout='vertical'
                size='large'
                onFinish={handleAddPromotion}
            >
                <Form.Item label='Tiêu đề:' name='title' rules={[{message: 'Vui lòng nhập tiêu đề!!', required: true}]}>
                    <Input placeholder='Nhập tiêu đề' allowClear/>
                </Form.Item>
                <Form.Item label='Mô tả:' name='description'>
                    <Input.TextArea rows={4} placeholder='Nhập mô tả' allowClear/>
                </Form.Item>
                <div className='grid grid-cols-2 gap-5'>
                    <div>
                        <Form.Item label='Lựa chọn:' name='type' rules={[{message: 'Vui lòng chọn loại chương trình!!', required: true}]} initialValue={'discount'}>
                            <Select options={[{value: 'Giảm giá', label: 'Giảm giá'}, {value: 'Khuyến mại', label: 'Khuyến mại'}]}/>
                        </Form.Item>
                        <Form.Item label='Số lượng:' name='numOfAvailabel' rules={[{message: 'Vui lòng nhập số lượng!!', required: true}]}>
                            <Input type='number' placeholder='Nhập số lượng áp dụng' min={0} allowClear/>
                        </Form.Item>
                        <Form.Item label='Ngày bắt đầu:' name='startAt' rules={[{message: 'Vui lòng nhập ngày bắt đầu !!', required: true}]}>
                            <DatePicker className='w-full' showTime format={'DD/MM/YYYY HH:mm:ss'} placeholder='Chọn ngày bắt đầu'/>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item label='Tạo mã CODE:' name='code' rules={[{message: 'Vui lòng tạo mã CODE !!', required: true}]}>
                            <Input placeholder='Tạo mã CODE' allowClear/>
                        </Form.Item>
                        <Form.Item label='Giảm giá/khuyến mại:' name='value' rules={[{message: 'Vui lòng nhập giá trị!!', required: true}]}>
                            <Input type='number' placeholder='Nhập giá trị' min={0} allowClear/>
                        </Form.Item>
                        <Form.Item label='Ngày kết thúc:' name='endAt' rules={[{message: 'Vui lòng nhập ngày kết thúc !!', required: true}]}>
                            <DatePicker className='w-full' showTime format={'DD/MM/YYYY HH:mm:ss'} placeholder='Chọn ngày kết thúc'/>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default AddPromotion
