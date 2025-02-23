import { Button, message, Modal, Space, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { AddPromotion } from '../modals'
import { PromotionModel } from '../models/PromotionModel'
import handleAPI from '../apis/handleAPI'
import { ColumnProps } from 'antd/es/table'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'
import { formatDate } from '../utils/formatDate'

const { confirm } = Modal

const PromotionScreen = () => {

  const [isVisibleAddPromorion, setIsVisibleAddPromorion] = useState(false)
  const [promotions, setPromotions] = useState<PromotionModel[]>([])
  const [promotionSelected, setPromotionSelected] = useState<PromotionModel>();
  const [isLoading, setIsLoading] = useState(false)

  const columns: ColumnProps<PromotionModel>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Mã CODE',
      width: 200,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tiêu đề'
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Mô tả'
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Giảm giá/khuyến mại',
      width: 200,
    },
    {
      key: 'value',
      dataIndex: 'value',
      title: 'Giá trị',
      width: 100,
      render: (value) => (
        <Typography.Text>{value} %</Typography.Text>
      )
    },
    {
      key: 'numOfAvailabel',
      dataIndex: 'numOfAvailabel',
      title: 'Số lượng',
      width: 100,
    },
    {
      key: 'dateTime',
      dataIndex: '',
      title: 'Thời gian',
      width: 200,
      render: (promotion: PromotionModel) => (
        <Typography.Text>{formatDate(promotion.startAt).split(' ')[1]} - {formatDate(promotion.endAt).split(' ')[1]}</Typography.Text>
      )
    },
    {
      key: 'action',
      title: 'Lựa chọn',
      align: 'center',
      fixed: 'right',
      dataIndex: '',
      width: 150,
      render: (promotion: PromotionModel) => <Space>
        <Button
          type='link'
          icon={<MdEditSquare size={20} className='text-blue-500' />}
          onClick={() => {
            setPromotionSelected(promotion)
            setIsVisibleAddPromorion(true)
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
                handleRemovePromotion(promotion._id)
                getPromotions()
              }
            })
          }}
        />
      </Space>
    }
  ]

  useEffect(() => {
    getPromotions()
  }, [])

  const handleRemovePromotion = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/promotion/delete-promotion?id=${id}`
      await handleAPI(api, undefined, 'delete')
      message.success('Xóa chương trình giảm giá/khuyến mại thành công')
    } catch (error: any) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPromotions = async () => {
    try {
      setIsLoading(true)
      const api = '/promotion'
      const res = await handleAPI(api)
      res.data && setPromotions(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={promotions}
        scroll={{
          x: '100%'
        }}
        title={() => (
          <div className='grid grid-rows-1 grid-cols-2'>
            <div>
              <Typography.Title level={5}>Bảng quản lý giảm giá/khuyến mại</Typography.Title>
            </div>
            <div className='text-end'>
              <Button type='primary' onClick={() => setIsVisibleAddPromorion(true)}>Thêm mới</Button>
            </div>
          </div>
        )}
      />
      <AddPromotion
        visible={isVisibleAddPromorion}
        onClose={() => {
          setPromotionSelected(undefined)
          setIsVisibleAddPromorion(false)
        }}
        onAddNew={(val) => { 
          getPromotions()
         }}
        promotion={promotionSelected} 
      />
    </div>
  )
}

export default PromotionScreen
