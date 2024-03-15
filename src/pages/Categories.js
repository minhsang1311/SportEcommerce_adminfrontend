import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Select, Space, Upload, message } from 'antd';
import {BsPlusSquare} from 'react-icons/bs'
import axios from 'axios';

function Categories() {
  
//Tag
const { Option } = Select;
const [categories, setCategories] = useState([]);
useEffect(() => {
        axios.get('http://localhost:8081/category1')
          .then((res) => {
       setCategories(res.data);
          })
          .catch((err) => {
            console.error('Error fetching brands:', err);
          });
      }, []);
//data
const [messageApi, contextHolder] = message.useMessage();
const [title, setTitle] = useState('');
const [parent, setParent] = useState([]);
const handleCreate = (e) => {
  if (!title) {
    messageApi.open({
      type: 'warning',
      content: 'Category Title is required',
    });
    return;
  }
  e.preventDefault();
  axios.post('http://localhost:8081/category', {title: title, description: editorHtml, parent_id: parent})
  .then(res => {
    setTitle('');
    setEditorHtml('');
    setParent('');
    messageApi.open({
      type: 'success',
      content: 'Category Created Successfully',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }).catch((err) => {messageApi.open({
    type: 'success',
    content: 'Error',
  });});
}
//Toolbar
const [editorHtml, setEditorHtml] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font',
    'list', 'bullet',
    'bold', 'italic', 'underline',
    'link', 'image',
    'align', 'color', 'background'
  ];
  const handleChange = (html) => {
    setEditorHtml(html);
  };
  return (
    <div className='container-md mb-4'>
          {contextHolder}
      <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Create Categories</Link></div>
      <h3 className='mb-4'>Create Categories</h3>
      <div className='basic-information p-5 mb-3'>
        <h5 className='mb-3'>Basic Information</h5>
        <div className='mb-3'>
        <h6 className='mb-3'>Name</h6>
        <input class="form-control" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Category" aria-label="Category"/>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <h6 className='mb-3'>Parent</h6>
    <Select
    size='large'
      allowClear
      style={{
        width: '100%',
      }}
      placeholder="Select Parent"
      onChange={(value) => setParent(value)}
      value={parent}
      >
      {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.title}
            </Option>
          ))}
    </Select>
          </div>
          </div>
        <div> 
        <h6 className='mb-3'>Description</h6>
  <ReactQuill className='mb-3'
value={editorHtml}
onChange={handleChange}
modules={modules}
formats={formats}
/>
        </div>
        <div className='d-flex justify-content-end'> <button onClick={handleCreate} type='submit' className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Category
      </button></div>
      </div>
    </div>
  )
}

export default Categories