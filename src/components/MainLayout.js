import React, { useEffect, useState } from 'react';
import {AiOutlineDashboard, AiOutlineShoppingCart} from 'react-icons/ai'
import { Layout, Menu, Button, theme } from 'antd';
import {HiArrowLeftOnRectangle, HiArrowRightOnRectangle, HiOutlineUsers} from 'react-icons/hi2';
import {SiBrandfolder} from 'react-icons/si'
import {FaClipboardList, FaMapLocationDot, FaMagnifyingGlassLocation, FaLocationDot} from 'react-icons/fa6'
import {FaSignOutAlt} from 'react-icons/fa'
import {BiCategoryAlt, BiSolidDiscount, BiDotsVerticalRounded} from 'react-icons/bi'
import {BsPersonCircle} from 'react-icons/bs'
import {IoNotifications} from 'react-icons/io5'
import {MdOutlineSportsSoccer, MdOutlineDiscount} from 'react-icons/md'
import {useNavigate, Outlet, Link, useParams} from 'react-router-dom';
import {TbShoppingCartDiscount} from 'react-icons/tb';
import axios from 'axios';
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(`http://localhost:8081/admin`)
    .then(res => {
      setUserName(res.data.userName);
      setEmail(res.data.email);
    })
  }, [])
  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      if(res.data.Status === "Success"){
        navigate('/');
      } else {alert("Error")}
     
    }).catch(err => console.log(err));
  }
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img className='sm-logo' src='./Logoadmins.png'/>
          <img className='lg-logo' src='/Logoadmin.png'/>
          </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}
          onClick={({key}) => {
            if(key == 'signout'){
              } else {
                navigate(key);
          }
        }}
          items={[
            {
              key: '',
              icon: <AiOutlineDashboard size={20} className='fs-4' />,
              label: 'Dashboard',
            },
            {
              key: 'customers',
              icon: <HiOutlineUsers size={20} className='fs-4' />,
              label: 'Custumers',
            },
            {
              key: 'Catalog',
              icon: <AiOutlineShoppingCart size={20} className='fs-4' />,
              label: 'Catalog',
              children:[
                {
                  key: 'add-products',
                  icon: <AiOutlineShoppingCart size={20} className='fs-4' />,
                  label: 'Add Products',
                },
                {
                  key: 'product-list',
                  icon: <AiOutlineShoppingCart size={20} className='fs-4' />,
                  label: 'Product List',
                },
                {
                  key: 'sport',
                  icon: <MdOutlineSportsSoccer size={20} className='fs-4' />,
                  label: 'Sport',
                },
                {
                  key: 'brand',
                  icon: <SiBrandfolder size={20} className='fs-4' />,
                  label: 'Brand',
                },
                {
                  key: 'categories',
                  icon: <BiCategoryAlt size={20} className='fs-4' />,
                  label: 'Categories',
                },
                {
                  key: 'category-list',
                  icon: <BiCategoryAlt size={20} className='fs-4' />,
                  label: 'Category List',
                },
              ]
            },
            {
              key: 'orders',
              icon: <FaClipboardList size={20} className='fs-4' />,
              label: 'Orders',
            },
            {
              key: 'location',
              icon: <FaLocationDot size={20} className='fs-4' />,
              label: 'Locations',
              children:[
                {
                  key: 'set-location',
                  icon: <FaMapLocationDot size={20} className='fs-4' />,
                  label: 'Set Location',
                },
                {
                  key: 'location-list',
                  icon: <FaMagnifyingGlassLocation size={20} className='fs-4' />,
                  label: 'Location List',
                },
                {
                  key: 'booking-location-list',
                  icon: <FaClipboardList size={20} className='fs-4' />,
                  label: 'Booking Location List',
                },
              ]
            },
            {
              key: 'enquiries',
              icon: <FaClipboardList size={20} className='fs-4' />,
              label: 'Enquiries',
            },
            {
              key: 'promotion',
              icon: <MdOutlineDiscount size={20} className='fs-4' />,
              label: 'Promotion',
              children:[
                {
                  key: 'discount',
                  icon: <BiSolidDiscount size={20} className='fs-4' />,
                  label: 'Discount',
                },
                {
                  key: 'discount-list',
                  icon: <TbShoppingCartDiscount size={20} className='fs-4' />,
                  label: 'Discount List',
                },
              ]
            },
          ]}
        />
      </Sider>
      <Layout className='site-layout'>
        <Header className='d-flex justify-content-between ps-3 pe-5'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <HiArrowRightOnRectangle size={30} /> : <HiArrowLeftOnRectangle size={30}/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 80,
              height: 80,
            }}
          />
          <div className='d-flex gap-4 align-items-center'>
            <div className='d-flex gap-3 align-items-center'>
              <BsPersonCircle size={30}/>
              <div>
                <h5 className='mb-0'>{userName}</h5>
                <p className='mb-0'>{email}</p>
                </div>  
            </div>
            <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu mt-3" aria-labelledby="dropdownMenuButton1">
      <li><div class="dropdown-item" href="#">
          <div className='d-flex align-items-center align-content-center gap-3'><p className='mb-0'>Account</p></div>
          </div>
          </li>
        <li><div onClick={handleLogout} class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'><p className='mb-0'>Log Out</p></div>
          </div>
          </li>
      </ul>
    </div>
        
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
            <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;