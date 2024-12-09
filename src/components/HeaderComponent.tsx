import { Avatar, Button, Dropdown, Input, MenuProps, Space } from 'antd'
import React from 'react'
import { FiSearch } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md"
import { colors } from '../constants/colors';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../redux/authReducer';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const items: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Đăng xuất',
            onClick: () => {
                dispatch(removeAuth({}))
                navigate('/')
            }
        }
    ]
    return (
        <div className='p-2 grid grid-cols-2 bg-white'>
            <div >
                <Input placeholder='Search product, supplier, order'
                    prefix={<FiSearch />}
                    size='large'
                    style={{
                        borderRadius: 100,
                        width: '50%'
                    }} />
            </div>
            <div className='text-end'>
                <Space>
                    <Button type='text' icon={<MdNotificationsNone size={30} color={colors.grey600}/>}/>
                    <Dropdown menu={{items}}>
                        <Avatar src={'https://i.pinimg.com/236x/f7/63/b9/f763b98b0a0502f892c2e464dec4d5a4.jpg'} size={40}/>
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}

export default HeaderComponent
