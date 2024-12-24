import { Layout, Menu, MenuProps, Typography } from 'antd'
import React from 'react'
import logo from '../assets/img/logo.svg'
import { Link } from 'react-router-dom'
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBarChart } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineEventNote } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { appInfo } from '../constants/appInfos';
import { colors } from '../constants/colors';

type MenuItem = Required<MenuProps>['items'][number]
const { Sider } = Layout
const { Text } = Typography

const SiderComponent = () => {
    const items: MenuItem[] = [
        {
            key: 'dashboard',
            label: <Link to={'/dashboard'}>Dashboard</Link>,
            icon: <TiHomeOutline size={18} />
        },

        {
            key: 'inventories',
            label: <Link to={'/inventory'}>Inventories</Link>,
            icon: <MdOutlineInventory2 size={18} />,
            children: [
                {
                    key: 'addNew',
                    label: <Link to={'/inventory'}>Inventory</Link>
                },
                {
                    key: 'inventory',
                    label: <Link to={'/inventory/add-new-product'}>Add New Product</Link>
                }
            ]
        },
        {
            key: 'reports',
            label: <Link to={'/reports'}>Reports</Link>,
            icon: <BsBarChart size={18} />
        },
        {
            key: 'suppliers',
            label: <Link to={'/suppliers'}>Suppliers</Link>,
            icon: <FaRegCircleUser size={18} />
        },
        {
            key: 'oders',
            label: <Link to={'/oders'}>Oders</Link>,
            icon: <BsBoxSeam size={18} />
        },
        {
            key: 'manage Store',
            label: <Link to={'/manage-store'}>Manage Store</Link>,
            icon: <MdOutlineEventNote size={18} />
        }
    ]
    return (
        <Sider theme='light' width={300} className='h-[100vh] p-2'>
            <div className='flex items-center pl-5'>
                <img src={logo} alt="Logo" width={28} />
                <Text style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '1.5rem', color: colors.primary500 }}>{appInfo.title}</Text>
            </div>
            <Menu mode='inline' items={items} theme='light' />
        </Sider>
    )
}

export default SiderComponent
