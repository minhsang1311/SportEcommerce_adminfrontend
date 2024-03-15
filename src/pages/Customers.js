import React, {useState, useRef, useEffect} from 'react'
import { Button, Input, Space, Table, message } from 'antd';
import {Link} from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {GiCancel} from 'react-icons/gi'
import axios from 'axios';
function Customers() {
  //data
  const [customers, setCustomers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    axios.get('http://localhost:8081/user_admin')
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/user_admin/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'User Deleted',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Cant delete users id ' + id,
      });
      console.error(err)
    })
  }
  const handleSetAdmin = (id) => {
    axios.put(`http://localhost:8081/setAdmin/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'User become admin',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Error' + id,
      });
      console.error(err)
    })
  }
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
          placeholder={`Search`}
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
      title: 'Name',
      width: 180,
      key: 'name',
      dataIndex: ['userName','email', 'image'],
      fixed: 'left',
      ...getColumnSearchProps(['userName','email']),
      render: (text, record) =>
      <div className='d-flex gap-3 align-items-center'>
        <div> <img style={{objectFit: 'cover', height: '50px', width:'50px'}} src={record.image}/> </div>
        <div className=''>
          <h5 className='mb-0'>{record.userName}</h5>
          <p className='mb-0'>{record.email}</p>
        </div>
      </div>,
    },
    {
      title: 'Registered',
      width: 60,
      dataIndex: 'date',
      key: 'date',
      sorter: (a,b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Phone Number',
      dataIndex: ['phone'],
      key: '1',
      width: 100,
      ...getColumnSearchProps(['phone'])
    },
    {
      title: 'Address',
      dataIndex: ['address'],
      key: '1',
      width: 100,
      ...getColumnSearchProps(['address'])
    },
    {
      title: 'Count Order',
      dataIndex: 'order_count',
      key: 'order_count',
      width: 50,
      sorter: (a,b) => a.countOrder - b.countOrder
    },
    {
      title: 'Spend',
      dataIndex: 'total_order_amount',
      key: 'total_order_amount',
      width: 50,
      render: (spend)=> <p className='mb-0'>$ {spend}</p>,
      sorter: (a,b) => a.spend - b.spend,
    },
    {
      title: 'Action',
      key: 'operation',
      width: 80,
      render: (text, record) => <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><button onClick={e => handleSetAdmin(record.id)} class="dropdown-item" href="#">
          <div className='d-flex align-items-center align-content-center gap-3'><LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Set Admin</p></div>
          </button>
          </li>
          <li><button onClick={e => handleDelete(record.id)} class="dropdown-item" href="#">
          <div className='d-flex align-items-center align-content-center gap-3'><GiCancel size={25} color='red'/><p className='mb-0' style={{color: 'red'}}>Delete</p></div>
          </button>
          </li>
      </ul>
    </div>,
    },
  ];

  
  return (
    <div className='list container-md'> 
    {contextHolder}
    <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Customers</Link></div>
      <h3 className='mb-4'>Customers</h3>
      <Table
      bordered
    columns={columns}
    dataSource={customers}
    scroll={{
      x: 1200,
      y: 850,
    }}
  />
    </div>
  )
}

export default Customers