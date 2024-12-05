import { Avatar, Button, Form, Input, message, Modal, Select, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { colors } from '../constants/colors';
import { uploadFile } from '../utils/uploadFile';
import { replaceName } from '../utils/repalceName';
import { wait } from '@testing-library/user-event/dist/utils';
import handleAPI from '../apis/handleAPI';
import { SupplierModel } from '../models/SupplierModel';

const { Paragraph } = Typography


interface Props {
  visible: boolean,
  onClose: () => void,
  onAddNew: (val: SupplierModel) => void,
  supplier?: SupplierModel
}

const ToogleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props

  const [isTaking, setIsTaking] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<any>()

  const inpRef = useRef<any>()

  const [form] = Form.useForm()

  const addNewSupplier = async (values: any) => {
    setIsLoading(true)
    const data: any = {} 

    for(const i in values){
      data[i] = values[i] ?? ''
    }

    data.price = values.price ? parseFloat(data.price) : 0
    data.isTaking = isTaking ? 1 : 0

    if(file) {
      data.photoUrl = await uploadFile(file)
    }
    
    data.slug = replaceName(values.name)

    try {
      const res = await handleAPI("/supplier/add-new", data, "post")
      message.success('Add Supplier Successfully')
      console.log(res.data);
      onAddNew(res.data)
      handleClose()
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }
  return (
    <Modal
      closable={!isLoading}
      width={700}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{loading: isLoading}}
      title='New Supplier'
      okText='Add Supplier'
      cancelText='Discard'>

      <label htmlFor='inpFile' className='flex justify-center items-center gap-5 my-5'>
        <div className='flex justify-center'>
          {file ? (
            <Avatar
              size={100}
              style={{
                backgroundColor: 'white',
                border: '2px dashed #5d6679',
                textAlign: 'center'
              }}
              src={URL.createObjectURL(file)}/>
          ) : (
            <Avatar
              size={100}  
              style={{
                backgroundColor: 'white',
                border: '2px dashed #5d6679',
                textAlign: 'center'
              }}>
              <FaRegUser size={70} style={{ color: colors.grey600 }} />
            </Avatar>
          )}
          
        </div>
        <div>
          <Paragraph style={{ margin: '0px' }}>Drag image heare</Paragraph>
          <Paragraph style={{ margin: '0px' }}>or</Paragraph>
          <Button onClick={() => inpRef.current.click()} type='link' style={{ padding: '0px' }}>Browse image</Button>
        </div>
      </label>

      <Form
        disabled={isLoading}
        onFinish={addNewSupplier}
        layout='horizontal'
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size='large'>
        <Form.Item name={'name'} label={'Supplier Name'} rules={[{ required: true, message: 'Please enter supplier name' }]}>
          <Input placeholder='Entersupplier name' allowClear />
        </Form.Item>
        <Form.Item name={'product'} label={'Product'}>
          <Input placeholder='Enter product' allowClear />
        </Form.Item>
        <Form.Item name={'category'} label={'Category'}>
          <Select options={[]} placeholder='Select product category' />
        </Form.Item>
        <Form.Item name={'price'} label={'Buying Price'}>
          <Input placeholder='Enter buying price' type='number' allowClear />
        </Form.Item>
        <Form.Item name={'contact'} label={'Contact Number'}>
          <Input placeholder='Enter supplier contact number' allowClear />
        </Form.Item>
        <Form.Item label={'Type'}>
          <div className='mb-3'>
            <Button onClick={() => setIsTaking(false)} type={isTaking === false ? 'primary' : 'default'}>Not taking return</Button>
          </div>
          <Button onClick={() => setIsTaking(true)} type={isTaking ? 'primary' : 'default'}>Taking return</Button>
        </Form.Item>
      </Form>

      <div className='hidden'>
        <input ref={inpRef} accept='image/*' type='file' id='inpFile' onChange={(val: any) => setFile(val.target.files[0])} />
      </div>
    </Modal>
  )
}

export default ToogleSupplier
