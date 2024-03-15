import React, {useState, useRef, useEffect} from 'react'
import { Button, Input, Space, Table, message } from 'antd';
import {Link} from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {BsPlusSquare} from 'react-icons/bs'
import {GiCancel} from 'react-icons/gi'
import axios from 'axios';


function Customers() {
  const [messageApi, contextHolder] = message.useMessage();
  //data
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8081/product')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, []);
   //delete
   const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/product/`+id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'Product Deleted',
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

  //table
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
      title: 'Product Name',
      width: 180,
      key: 'information',
      dataIndex: ['productName', 'product_id', 'SKU', 'productImage'],
      fixed: 'left',
      ...getColumnSearchProps(['productName','product_id','SKU']),
      render: (text, record) =>
      <div className='d-flex gap-3 align-items-center'>
        <div> <img style={{objectFit: 'cover', height: '50px', width:'50px'}} src={record.productImage}/> </div>
        <div className=''>
          <h6 className='mb-0'>{record.productName}</h6>
          <div className='d-flex'><p className='mb-0'>ID: {record.product_id} | SKU: {record.SKU}</p></div>
        </div>
      </div>,
    },
    {
      title: 'Category',
      width: 100,
      dataIndex: 'category',
      key: 'age',
      ...getColumnSearchProps(['category']),
    },
    {
      title: 'Sport',
      dataIndex: 'sport',
      key: 'sport',
      width: 100,
      ...getColumnSearchProps(['sport']),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      ...getColumnSearchProps(['brand']),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a,b) => a.quantity - b.quantity,
    },
    {
      title: 'Price',
      dataIndex: 'discount',
      key: 'price',
      width: 100,
      render: (price)=> <p className='mb-0'>$ {price}</p>,
      sorter: (a,b) => a.price - b.price,
    },
    {
      title: 'Action',
      key: 'operation',
      width: 80,
      render: (text, record) => <div class="dropdown">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><Link to={`${record.product_id}`} class="dropdown-item" href="#">
          <div className='d-flex align-items-center align-content-center gap-3'><LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Edit</p></div>
          </Link>
          </li>
          <li><button onClick={e => handleDelete(record.product_id)} class="dropdown-item">
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
    <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Product List</Link></div>
      <h3 className='mb-4'>Product List</h3>
      <Link to='/admin/add-products' className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Product
      </button>
      </Link>
      <Table
      bordered
    columns={columns}
    dataSource={products}
    scroll={{
      x: 1200,
      y: 850,
    }}
  />
    </div>
  )
}

export default Customers