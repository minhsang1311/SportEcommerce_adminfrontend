import React from 'react'
import { Column } from '@ant-design/plots';
import { Table } from 'antd';
import { Pie } from '@ant-design/plots';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {SiCodereview} from 'react-icons/si'
import {Link} from 'react';
import {MdOutlineNorthEast, MdOutlineSouthEast} from 'react-icons/md'
import {FaCheckCircle} from 'react-icons/fa'
import {GiCancel} from 'react-icons/gi'
import {axios} from 'axios';

const Dashboard = () => {
  const Orders =  [{
    title: 'ID',
    width: 50,
    dataIndex: 'key',
    key: 'i',
    fixed: 'left'
  },
  {
    title: 'Date',
    width: 70,
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Customer',
    dataIndex: 'key',
    key: '1',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'Status',
    width: 70,
    dataIndex: 'key',
    key: 'i',
  },
  {
    title: 'Total',
    dataIndex: 'key',
    key: '4',
    width: 60,
  },
  {
    title: 'Action',
    key: 'operation',
    width: 60,
    render: () => <div class="dropdown">
    <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">
        <div className='d-flex align-items-center align-content-center gap-3'><SiCodereview size={25} color='blue'/><p className='mb-0' style={{color: 'blue'}}>View</p></div>
        </a>
        </li>
        <li><a class="dropdown-item" href="#">
        <div className='d-flex align-items-center align-content-center gap-3'><FaCheckCircle size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Complete</p></div>
        </a>
        </li>
        <li><a class="dropdown-item" href="#">
        <div className='d-flex align-items-center align-content-center gap-3'><GiCancel size={25} color='red'/><p className='mb-0' style={{color: 'red'}}>Canceled</p></div>
        </a>
        </li>
    </ul>
  </div>,
  },]
  const dataOrders = [];
  for (let i = 0; i < 100; i++) {
    dataOrders.push({
      key: i,
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }

  const data = [
    {
      month: 'Jan',
      sales: 38.5,
    },
    {
      month: 'Feb',
      sales: 52,
    },
    {
      month: 'Mar',
      sales: 61,
    },
    {
      month: 'Apr',
      sales: 145,
    },
    {
      month: 'May',
      sales: 48,
    },
    {
      month: 'Jun',
      sales: 38,
    },
    {
      month: 'July',
      sales: 38,
    },
    {
      month: 'Aug',
      sales: 38,
    },
    {
      month: 'Sep',
      sales: 38,
    },
    {
      month: 'Oct',
      sales: 38,
    },
    {
      month: 'Nov',
      sales: 38,
    },
    {
      month: 'Dec',
      sales: 38,
    },
    {
      type: 'Football',
      value: 27,
    },
    {
      type: 'Gym',
      value: 25,
    },
    {
      type: 'Basketball',
      value: 18,
    },
    {
      type: 'Golf',
      value: 15,
    },
    {
      type: 'Swim',
      value: 10,
    },
    {
      type: 'Badminton',
      value: 5,
    },
  ];
  const Chart = {
    data,
    xField: 'month',
    yField: 'sales',
    color: ({ type }) => {
      return '#febd69';
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Months',
      },
      sales: {
        alias: 'Income',
      },
    },
  };
 
  const pieChart = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <div className='dashboard container-md'>
      <h3 className='mb-4'>Dashboard</h3>
      <div className='calculator d-flex justify-content-between align-items-center gap-3'>
        <div className='col bg-white p-3'>
          <div className='left'>    
          <div className=''>Total sells</div>      
            <h1 className='mb-0'>$1100</h1>
          </div>
          <div className='right'>
            <BiDotsVerticalRounded size={25}/>
            <div className='percent'>
              <MdOutlineNorthEast className='up' size={25} color='green'/><MdOutlineSouthEast className='down' size={25} color='red'/>
              <h4 className=''>32%</h4>
            </div>
            <p className='mb-0'>Compare To April 2022</p>
          </div>

        </div>
        <div className='col bg-white p-3'>
          <div className='left'>
            <p className=''>Average order value</p>
            <h1 className='mb-0'>$1100</h1>
          </div>
          <div className='right'>
            <BiDotsVerticalRounded size={25}/>
            <div className='percent'>
            <MdOutlineNorthEast className='up' size={25} color='green'/><MdOutlineSouthEast className='down' size={25} color='red'/>
              <h4 className=''>32%</h4>
            </div>
            <p className='mb-0'>Compare To April 2022</p>
          </div>

        </div>
        <div className='col bg-white p-3'>
          <div className='left'>
            <p className=''>Total orders</p>
            <h1 className='mb-0'>1100</h1>
          </div>
          <div className='right'>
            <BiDotsVerticalRounded size={25}/>
            <div className='percent'>
            <MdOutlineNorthEast className='up' size={25} color='green'/><MdOutlineSouthEast className='down' size={25} color='red'/>
              <h4>32%</h4>
            </div>
            <p className='mb-0'>Compare To April 2022</p>
          </div>

        </div>
      </div>
      <div className='d-flex flex-col gap-3 mt-4'>
        <div className='col p-3 user'>
          <h3 className='mb-4'>Active User</h3>
          <div className='user-online p-3'><h1>150 User Online</h1></div>
        </div>
      <div className='col-8 income-static'>
        <h3 className='mb-4 p-3'>Income Static</h3>
        <div className='chart'> <Column {...Chart} /></div>
        
      </div>
      </div>
      <div className='d-flex flex-col mt-4'>
        <div className='col-8 p-3 orders'>
        <h3 className='mb-4'>New Orders</h3>
        <div>
        <Table bordered columns={Orders} dataSource={dataOrders}
        scroll={{
          x: 600
        }}/>
        </div>
        </div>
      <div className='col-4 p-3 pie'>
        <h3 className='mb-4'>Sport Percent</h3>
        <div className='pie-chart'><Pie {...pieChart} /></div>
      </div>
      </div>
    </div>
  )
}
export default Dashboard