import React, {useState, useRef, useEffect} from 'react'
import { Table, Button, Input, Space, message } from 'antd';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {GiCancel} from 'react-icons/gi'
import {BsPlusSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

function Listcategory() {
  const [messageApi, contextHolder] = message.useMessage();
  //display 
  const [categories, setCategories] = useState([]);
      useEffect(() => {
        axios.get('http://localhost:8081/category')
          .then((response) => {
            setCategories(response.data);
          })
          .catch((error) => {
            console.error('Error fetching brands:', error);
          });
      }, []);

   //delete
   const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/category/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'Category Deleted',
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
  //list
  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'categoryID',
      key: 'categoryID',
    },
    {
      title: 'Category',
      width: 300,
      dataIndex: 'categoryTitle',
      key: 'title',
      ...getColumnSearchProps(['title']),
    },
    {
      title: 'Parent',
      width: 300,
      dataIndex: 'parentCategoryName',
      key: 'parentCategoryName',
      ...getColumnSearchProps(['parentCategoryName']),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 150,
      sorter: (a,b) => a.items - b.items,
    },
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: (text, record) => <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><Link to={`${record.categoryID}`} class="dropdown-item" href="#">
          <div className='d-flex align-items-center align-content-center gap-3'><LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Edit</p></div>
          </Link>
          </li>
          <li><button onClick={e => handleDelete(record.categoryID)} class="dropdown-item">
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
     <div className='link'><div>Dashboard / Category List</div></div>
      <h3 className='mb-4'>Category List</h3>
      <Link to='/admin/categories' className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Category
      </button>
      </Link>
      <Table
      bordered
    columns={columns}
    dataSource={categories}
  />
    </div>
  )
}

export default Listcategory