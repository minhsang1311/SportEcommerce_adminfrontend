import React, {useState, useRef, useEffect} from 'react'
import { Table, Button, Modal, Input, Space, message } from 'antd';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {GiCancel} from 'react-icons/gi'
import {BsPlusSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

function Brand() {
   //CreateButton
const [isModalOpen1, setIsModalOpen1] = useState(false);
const [isModalOpen2, setIsModalOpen2] = useState(false);
const [id, setId] = useState('');
 const showModal1 = () => {
   setIsModalOpen1(true);
   setBrandName('');
 };
 const handleCancel1 = () => {
   setIsModalOpen1(false);
 };
 const showModal2 = (id) => {
  setIsModalOpen2(true);
  axios.get(`http://localhost:8081/brand/${id}`)
  .then((response) => {
    setBrandName(response.data.brandName);
  })
  .catch((error) => {
    console.error('Error fetching brands:', error);
  });
  setId(id);
};

const handleCancel2 = () => {
  setIsModalOpen2(false);
};
      //data 
      //display
      const [brands, setBrands] = useState([]);
      useEffect(() => {
        axios.get('http://localhost:8081/brand')
          .then((response) => {
            setBrands(response.data);
          })
          .catch((error) => {
            console.error('Error fetching brands:', error);
          });
      }, []);
      //create
      const [brandName, setBrandName] = useState('');
      const [messageApi, contextHolder] = message.useMessage();
      axios.defaults.withCredentials = true;
      const handleCreateBrand = (e) => {
        if (!brandName) {
          messageApi.open({
            type: 'warning',
            content: 'Brand Name is required',
          });
          return;
        }
        e.preventDefault();
        axios.post('http://localhost:8081/brand', {brandName})
        .then(res => {
          setIsModalOpen1(false);
          setBrandName('');
          messageApi.open({
            type: 'success',
            content: 'Brand Created Successfully',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }).catch((err) => console.log(err));
      }
      //edit
      const handleEdit = (e) => {
        axios
          .put(`http://localhost:8081/brand/${id}`, {brandName: brandName})
          .then((res) => {
            messageApi.open({
                type: 'success',
                content: 'Brand Edited Successfully',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
          })
          .catch((error) => {
            messageApi.open({
                type: 'warning',
                content: 'Brand Edited Error',
              });
            console.error(error);
          });
      }
      //delete
      const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/brand/`+id)
        .then (res => {
          messageApi.open({
            type: 'success',
            content: 'Brand Deleted',
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }).catch((err) => {
          messageApi.open({
            type: 'warning',
            content: 'Cant delete brand id ' + id + err,
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
      title: 'ID.',
      width: 100,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Brand Name',
      width: 300,
      dataIndex: 'brandName',
      key: 'brandName',
      ...getColumnSearchProps(['brandName']),
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
      render: (text, record) => <div class="dropdown fixed">
      <BiDotsVerticalRounded type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" size={25}/>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li>
          <button onClick = {e => showModal2(record.id)} class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'>
            <LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Edit</p>
            </div>
          </button>
        </li>
        <li>
          <button onClick={e => handleDelete(record.id)} class="dropdown-item">
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
     <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Brand</Link></div>
     <h3 className='mb-4'>Brand List</h3>
     <div className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3' onClick={showModal1}>
      {<BsPlusSquare />} Create New Brand
      </button>
      <Modal title="Create Brand" open={isModalOpen1} onOk={handleCreateBrand} onCancel={handleCancel1}
      footer={[
        <Button style={{backgroundColor:'green'}} key="submit" type="primary" onClick={handleCreateBrand}>
          Create
        </Button>,
        <Button key="back" onClick={handleCancel1}>
          Cancel
        </Button>,
      ]}>
         <div class="input-group">
  <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} required class="form-control" aria-label="Brand" placeholder='Create New Brand'/>
</div>
      </Modal>
      <Modal title="Edit Brand" open={isModalOpen2} onOk={handleEdit} onCancel={handleCancel2}
      footer={[
        <Button style={{backgroundColor:'green'}} key="submit" type="primary" onClick={handleEdit}>
          Edit
        </Button>,
        <Button key="back" onClick={handleCancel2}>
          Cancel
        </Button>,
      ]}>
         <div class="input-group">
  <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} required class="form-control" aria-label="Brand" placeholder={brandName}/>
</div>
      </Modal>
      </div>    
      <Table
      bordered
    columns={columns}
    dataSource={brands}
    scroll={{
      x: 1200,
      y: 640,
    }}
  />
    </div>
  )
}

export default Brand