import React, {useState, useRef, useEffect} from 'react'
import { Table, Button, Modal, Input, Space, message } from 'antd';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {LuEdit} from 'react-icons/lu'
import {GiCancel} from 'react-icons/gi'
import {BsPlusSquare} from 'react-icons/bs'
import {Link, useParams} from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

function Sport() {
    //CreateButton
const [isModalOpen1, setIsModalOpen1] = useState(false);
const [isModalOpen2, setIsModalOpen2] = useState(false);
const [idSport, setIdSport] = useState('');
 const showModal1 = () => {
   setIsModalOpen1(true);
   setSportName('');
 };
 const handleCancel1 = () => {
   setIsModalOpen1(false);
 };
 const showModal2 = (id) => {
  setIsModalOpen2(true);
  axios.get(`http://localhost:8081/sport/${id}`)
  .then((response) => {
    setSportName(response.data.sportName);
  })
  .catch((error) => {
    console.error('Error fetching brands:', error);
  });
  setIdSport(id);
};

const handleCancel2 = () => {
  setIsModalOpen2(false);
};
    //data 
    //display
    const [sports, setSports] = useState([]);
    useEffect(() => {
      axios.get('http://localhost:8081/sport')
        .then((response) => {
          setSports(response.data);
        })
        .catch((error) => {
          console.error('Error fetching Sports:', error);
        });
    }, []);
    //create
    const [sportName, setSportName] = useState('');
      const [messageApi, contextHolder] = message.useMessage();
      axios.defaults.withCredentials = true;
      const handleCreateSport = (e) => {
        if (!sportName) {
          messageApi.open({
            type: 'warning',
            content: 'Sport Name is required',
          });
          return;
        }
        e.preventDefault();
        axios.post('http://localhost:8081/sport', {sportName})
        .then(res => {
          setIsModalOpen1(false);
          setSportName('');
          messageApi.open({
            type: 'success',
            content: 'Sport Created Successfully',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }).catch((err) => console.log(err));
      }
      //edit
      const handleEdit = (e) => {
        axios
          .put(`http://localhost:8081/sport/${idSport}`, {sportName})
          .then((res) => {
            messageApi.open({
                type: 'success',
                content: 'Sport Edited Successfully',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
          })
          .catch((error) => {
            messageApi.open({
                type: 'warning',
                content: 'Sport Edited Error',
              });
            console.error(error);
          });
      }
      //delete
      const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/sport/`+id)
        .then (res => {
          messageApi.open({
            type: 'success',
            content: 'Sport Deleted',
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
      title: 'No.',
      width: 100,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sport',
      width: 300,
      dataIndex: 'sportName',
      key: 'sportName',
      ...getColumnSearchProps(['sportName']),
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
        <li><button onClick = {e => showModal2(record.id)} class="dropdown-item">
          <div className='d-flex align-items-center align-content-center gap-3'><LuEdit size={25} color='green'/><p className='mb-0' style={{color: 'green'}}>Edit</p></div>
          </button>
          </li>
          <li><button onClick={e => handleDelete(record.id)} class="dropdown-item">
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
     <div className='link'><div>Dashboard/ Sport</div></div>
      <h3 className='mb-4'>Sport List</h3>
      <div className='d-flex justify-content-end'> <button className='btn btn-success btn-lg mb-3' onClick={showModal1}>
      {<BsPlusSquare />} Create New Sport
      </button>
      <Modal title="Create New Sport" open={isModalOpen1}  onSubmit={handleCreateSport} onCancel={handleCancel1}
      footer={[
        <Button style={{backgroundColor:'green'}} key="submit" type="primary" onClick={handleCreateSport}>
          Create
        </Button>,
        <Button key="back" onClick={handleCancel1}>
          Cancel
        </Button>,
      ]}>
         <div class="input-group">
  <input type="text" value={sportName} onChange={(e) => setSportName(e.target.value)} class="form-control" aria-label="Sport" placeholder='New Sport'/>
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
  <input type="text" value={sportName} onChange={(e) => setSportName(e.target.value)} required class="form-control" aria-label="Sport" placeholder={sportName}/>
</div>
      </Modal>
      </div>    
      <Table
      bordered
    columns={columns}
    dataSource={sports}
    scroll={{
      x: 1200,
      y: 640,
    }}
  />
    </div>
  )
}

export default Sport