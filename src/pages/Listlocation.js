import React, {useState, useRef, useEffect} from 'react'
import { Button, Input, Space, Table, message } from 'antd';
import {Link} from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {GiCancel} from 'react-icons/gi'
import {BsPlusSquare} from 'react-icons/bs'
import axios from 'axios';


function Listlocation() {
  const [messageApi, contextHolder] = message.useMessage();
  //data
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/location')
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, []);
   //delete
   const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/location/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'Location Deleted',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Cant delete Location id ' + id,
      });
      console.error(err)
    })
  }
  //Find 
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
  //List
  const columns = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'location_id',
      key: 'location_id',
      ...getColumnSearchProps(['location_id']),
    },
    {
      title: 'Name',
      width: 150,
      dataIndex: 'locationName',
      key: 'nameLocation',
      ...getColumnSearchProps(['locationName']),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      ...getColumnSearchProps(['address']),
    },
    {
      title: 'Sport',
      width: 150,
      dataIndex: 'sport',
      key: 'sport',
      ...getColumnSearchProps(['sport']),
    },
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: (text, record) => <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><Link to={`${record.location_id}`}  class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'><LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Edit</p></div>
          </Link>
          </li>
          <li><button onClick={e => handleDelete(record.location_id)} class="dropdown-item">
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
     <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Location List</Link></div>
      <h3 className='mb-4'>Location List</h3>
      <Link to='/admin/set-location' className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Location
      </button>
      </Link>
      <Table
      bordered
    columns={columns}
    dataSource={locations}
    scroll={{
      x: 1200,
      y: 640,
    }}
  />
    </div>
  )
}

export default Listlocation