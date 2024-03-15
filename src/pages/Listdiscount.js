import React, {useState, useEffect, useRef} from 'react'
import { Table, Tag, Button, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {SiCodereview} from 'react-icons/si'
import {FaCheckCircle} from 'react-icons/fa'
import {GiCancel} from 'react-icons/gi'
import Highlighter from 'react-highlight-words';
import {BsPlusSquare} from 'react-icons/bs'
import axios from 'axios';

function Listdiscount() {
  //data 
  const [messageApi, contextHolder] = message.useMessage();
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/coupon')
      .then((res) => {
   setCoupons(res.data);
      })
      .catch((err) => {
        console.error('Error fetching brands:', err);
      });
  }, []);
  const handleEnable = (id) => {
    axios.put(`http://localhost:8081/couponEna/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'Change Enable',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Cant delete category id ' + id,
      });
      console.error(err)
    })
  }
  const handleDisable = (id) => {
    axios.put(`http://localhost:8081/couponDis/`+id)
    .then (res => {
      messageApi.open({
        type: 'warning',
        content: 'Change Disable',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Cant delete category id ' + id,
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
      title: 'No.',
      width: 30,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (a,b) => a.key - b.key
    },
    {
      title: 'Coupon Code',
      width: 100,
      dataIndex: 'code',
      key: 'code',
      ...getColumnSearchProps(['code']),
    },
    {
      title: 'Status',
      width: 50,
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <>
          {(() => {
      let color;
      if (record.status === 'Enable') {
        color = 'green';
      } else if (record.status === 'Disable') {
        color = 'red';
      }
      return (
        <Tag color={color} key={record.status}>
          {record.status.toUpperCase()}
        </Tag>
      );
    })()}
        </>
      ),
      filters: [
        {
          text: 'Enable',
          value: 'Enable',
        },
        {
          text: 'Disable',
          value: 'Disable',
        }
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      ...getColumnSearchProps(['type']),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 50,
      ...getColumnSearchProps(['value']), 
      render: (text, record) => (
        <>
          {(() => {
            let inputValue = '';
            if (record.type === 'Percentage') {
              inputValue = '%';
            } else if (record.type === 'Fixed amount' || record.type === 'Free Shipping') {
              inputValue = '$';
            }
            return (
              <div>{`${inputValue} ${record.value}`}</div>
            );
          })()}
        </>
      )
    },
    {
      title: 'Usage Limit',
      width: 80,
      dataIndex: 'usage_limit',
      key: 'usage_limit',
      render: (text, record) => <div>$ {record.usage_limit}</div>
    },
    {
      title: 'Action',
      key: 'operation',
      width: 60,
      render: (text, record) => <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><button onClick={e => handleEnable(record.id)} class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'><FaCheckCircle size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Enable</p></div>
          </button>
          </li>
          <li><button onClick={e => handleDisable(record.id)} class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'><GiCancel size={25} color='red'/><p className='mb-0' style={{color: 'red'}}>Disable</p></div>
          </button>
          </li>
      </ul>
    </div>,
    },
  ];
const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase); };
  
  return (
    <div className='list container-md'> 
    {contextHolder}
     <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Coupon List</Link></div>
     <h3 className='mb-4'>Coupon List</h3>
      <Link to='/admin/discount' className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Coupon
      </button>
      </Link>
      <Table
      bordered
    columns={columns}
    dataSource={coupons}
    scroll={{
      x: 1200,
      y: 640,
    }}
  />
    </div>
  )
}

export default Listdiscount