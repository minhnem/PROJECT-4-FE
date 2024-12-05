import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Layout } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inventory from '../screens/Inventory'
import Dashboard from '../screens/Dashboard'
import Reports from '../screens/Reports'
import Suppliers from '../screens/Suppliers'
import Oders from '../screens/Oders'
import ManageStore from '../screens/ManageStore'
import { HeaderComponent, SiderComponent } from '../components'

const { Content, Footer, Header, Sider } = Layout

const MainRouter = () => {

  return (
    <BrowserRouter>
      <Layout>
        <SiderComponent/>
        <Layout>
          <HeaderComponent />
          <Content className='mt-3 mb-2 mx-auto container bg-white'>
            <Routes>
              <Route path='/' element={<HomeScreen />}/>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/inventory' element={<Inventory />}/>
              <Route path='/reports' element={<Reports />}/>
              <Route path='/suppliers' element={<Suppliers />}/>
              <Route path='/oders' element={<Oders />}/>
              <Route path='/manage-store' element={<ManageStore />}/>
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default MainRouter
