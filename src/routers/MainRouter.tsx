import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Affix, Layout } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../screens/Dashboard'
import Reports from '../screens/Reports'
import Suppliers from '../screens/Suppliers'
import Oders from '../screens/Oders'
import ManageStore from '../screens/ManageStore'
import AddProduct from '../screens/inventories/AddProduct'
import Inventory from '../screens/inventories/Inventory'
import { HeaderComponent, SiderComponent } from '../components'
import Category from '../screens/Category'

const { Content, Footer, Header, Sider } = Layout

const MainRouter = () => {
  
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent/>
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className='mx-auto p-6 container'>
            <Routes>
              <Route path='/' element={<HomeScreen />}/>
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route>
                <Route path='/inventory' element={<Inventory />}/>
                <Route path='/inventory/add-new-product' element={<AddProduct />}/>
              </Route>
              <Route path='/category' element={<Category />}/>
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
