import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Link, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Select, Space, Upload, message } from 'antd';
import {BsPlusSquare} from 'react-icons/bs'
import axios from 'axios';

function EditCategory() {

//Tag
const {idCategory} = useParams();
const { Option } = Select;
//data
const [messageApi, contextHolder] = message.useMessage();
const [title, setTitle] = useState('');
const [parent, setParent] = useState([]);
const [categories, setCategories] = useState([]);
const [editorHtml, setEditorHtml] = useState('');
useEffect(() => {
        axios.get('http://localhost:8081/category1')
          .then((res) => {
       setCategories(res.data);
          })
          .catch((err) => {
            console.error('Error fetching:', err);
          });
      }, []);
useEffect(() => {
        axios.get(`http://localhost:8081/category/${idCategory}`)
          .then((res) => {
       setTitle(res.data.categoryTitle);
       setParent(res.data.parentCategoryName);
       setEditorHtml(res.data.categoryDescription);
          })
          .catch((err) => {
            console.error('Error fetching:', err);
          });
      }, []);
const handleCreate = (e) => {
  if (!title) {
    messageApi.open({
      type: 'warning',
      content: 'Brand Name is required',
    });
    return;
  }
  e.preventDefault();
  axios.put('http://localhost:8081/category/'+idCategory,  {title: title, description: editorHtml, parent_id: parent})
  .then(res => {
    messageApi.open({
      type: 'success',
      content: 'Category Edited',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }).catch((err) => {messageApi.open({
    type: 'warning',
    content: 'Error',
  });});
}
//Toolbar


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
      <div className='link'><div>Dashboard / Edit Category</div></div>
      <h3 className='mb-4'>Edit Category</h3>
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
      {<BsPlusSquare />} Edit Category
      </button></div>
      </div>
    </div>
  )
}

export default EditCategory