import { Avatar, Button, Dropdown, Input, MenuProps, Space } from 'antd'
import React from 'react'
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md"
import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, removeAuth } from '../redux/authReducer';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(authSelector)
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
                        {user.photoUrl ? <Avatar src={user.photoUrl} size={40}/> : <Avatar size={40}> <FaRegUser color='black'/> </Avatar>}
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}

export default HeaderComponent
