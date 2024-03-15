import React, {useState, useRef} from 'react'
import { Table, Tag, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {SiCodereview} from 'react-icons/si'
import {FaCheckCircle} from 'react-icons/fa'
import {GiCancel} from 'react-icons/gi'
import Highlighter from 'react-highlight-words';
function Orders() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
    dataIndex.some((key) =>
      record[key].toString().toLowerCase().includes(value.toLowerCase())
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'ID',
      width: 50,
      dataIndex: 'id',
      key: 'i',
      ...getColumnSearchProps(['id'])
    },
    {
      title: 'Date',
      width: 70,
      dataIndex: 'date',
      key: 'date',
      fixed: 'left',
      sorter: (a,b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Customer',
      width: 150,
      key: 'name',
      dataIndex: ['name','email'],
      fixed: 'left',
      ...getColumnSearchProps(['name','email']),
      render: (text, record) =>
      <div className='d-flex gap-3 align-items-center'>
        <div> <img style={{objectFit: 'cover', height: '50px', width:'50px'}} src={record.profileImage}/> </div>
        <div className=''>
          <h5 className='mb-0'>{record.name}</h5>
          <p className='mb-0'>{record.email}</p>
        </div>
      </div>,
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      width: 50,
      render: (_, { paid }) => (
        <>
          {paid.map((tag) => {
            let color = tag.length > 5 ? 'red' : 'green';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      filters: [
        {
          text: 'Paid',
          value: 'Paid',
        },
        {
          text: 'Unpaid',
          value: 'Unpaid',
        },
      ],
      onFilter: (value, record) => record.paid.includes(value),
    },
    {
      title: 'Status',
      width: 50,
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <>
          {status.map((tag) => {
            let color;
            if (tag === 'Delivery') {
              color = 'blue';
            } if (tag === 'Checking') {
              color = 'orange';
            } if (tag === 'Completed') {
              color = 'green';
            } if (tag === 'Canceled') {
              color = 'red';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      filters: [
        {
          text: 'Checking',
          value: 'Checking',
        },
        {
          text: 'Delivery',
          value: 'Delivery',
        },
        {
          text: 'Completed',
          value: 'Completed',
        },
        {
          text: 'Canceled',
          value: 'Canceled',
        },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: '3',
      width: 50,
      sorter: (a,b) => a.items - b.items,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: '4',
      width: 50,
      render: (total)=> <p className='mb-0'>$ {total}</p>,
      sorter: (a,b) => a.total - b.total,
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
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      date: '2023-8-15',
      name: `Edward ${i}`,
      email: `Edward${i+1}@gmail.com`,
      profileImage: 'https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2022/11/12/161391269.jpg',
      paid: ['Paid', 'Unpaid'],
      status: ['Completed', 'Canceled', 'Delivery', 'Checking'],
      items: 3+i,
      total: (3+i)*150,
    });
  }
  return (
    <div className='list container-md'> 
     <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Orders</Link></div>
      <h3 className='mb-4'>Orders</h3>
      <Table
      bordered
    columns={columns}
    dataSource={data}
    scroll={{
      x: 1200,
      y: 850,
    }}
  />
    </div>
  )
}

export default Orders