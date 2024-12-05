import { Button, Space, Typography } from 'antd'
import Table, { ColumnProps } from 'antd/es/table'
import React, { useState } from 'react'
import { FiFilter } from "react-icons/fi";
import { ToogleSupplier } from '../modals';
import { SupplierModel } from '../models/SupplierModel';

const { Title } = Typography

const Suppliers = () => {

  const [isVisibleModelAddNew, setIsVisibleModelAddNew] = useState(false)

  const columns: ColumnProps<SupplierModel>[] = []

  return (
    <div>
      <Table dataSource={[]}
        columns={columns}
        title={() => (
          <div className='grid grid-rows-1 grid-cols-2'>
            <div>
              <Title level={5}>Suppliers</Title>
            </div>
            <div className='text-end'>
              <Space>
                <Button type='primary' onClick={() => setIsVisibleModelAddNew(true)}>Add Suppliers</Button>
                <Button icon={<FiFilter />}>Filter</Button>
                <Button>Download All</Button>
              </Space>
            </div>
          </div>
        )}
      />

      <ToogleSupplier visible={isVisibleModelAddNew} onClose={() => setIsVisibleModelAddNew(false)} onAddNew={val => console.log(val)} />
    </div>
  )
}

export default Suppliers
