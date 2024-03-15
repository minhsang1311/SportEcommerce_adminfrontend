import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Select, Space, Upload, Option, message, Button, Modal } from 'antd';
import {BsPlusSquare} from 'react-icons/bs'
import ImgCrop from 'antd-img-crop';
import axios from 'axios';




function Addproducts() {
  const [messageApi, contextHolder] = message.useMessage();
//data
const [name, setName] = useState('');
const [SKU, setSKU] = useState('');
const [quantity, setQuantity] = useState(null);
const [price, setPrice] = useState(null);
const [discount, setDiscount] = useState(null);
const [category, setCategory] = useState(null);
const [brand, setBrand] = useState(null);
const [sport, setSport] = useState(null);
const handleCreate = () => {
  const features = featuresData.map((value, index) => ({
    id: index + 1, // You can assign a unique ID here if needed
    feature_name: value,
  }));
axios.post('http://localhost:8081/product', {
    name: name, 
    SKU: SKU,
    description: editorHtml,
    quantity: quantity,
    price: price,
    discount: discount,
    category_id: category,
    brand_id: brand,
    sport_id: sport,
    features: features,
  })
  .then(res => {
    setIsModalOpen(true);
  }).catch((err) => 
  {console.log(err)
    messageApi.open({
    type: 'warning',
    content: 'Error',
  });});
}
//Tag
const { Option } = Select;
const [brands, setBrands] = useState([]);
useEffect(() => {
        axios.get('http://localhost:8081/brand1')
          .then((res) => {
       setBrands(res.data);
          })
          .catch((err) => {
            console.error('Error fetching brands:', err);
          });
      }, []);
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
const [sports, setSports] = useState([]);
useEffect(() => {
        axios.get('http://localhost:8081/sport1')
          .then((res) => {
       setSports(res.data);
          })
          .catch((err) => {
            console.error('Error fetching brands:', err);
          });
      }, []);
// add input
const [inputCount, setInputCount] = useState(1);
const [featuresData, setFeaturesData] = useState([null]); // Array to store input values

  const handleAddInput = () => {
    setInputCount(inputCount + 1);
    setFeaturesData([...featuresData, '']); // Add an empty value for the new input
  };

  const handleInputChange = (value, index) => {
    const newInputValues = [...featuresData];
    newInputValues[index] = value;
    setFeaturesData(newInputValues);
  };
  const handleDeleteInput = (index) => {
    const newInputValues = [...featuresData];
    newInputValues.splice(index, 1); // Remove the input value at the specified index
    setFeaturesData(newInputValues);
    setInputCount(inputCount - 1);}


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
//Upload Image
const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: 'Product Created Successfully',
    });
    setName('');
    setCategory('');
    setSKU('');
    setEditorHtml('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setBrand('');
    setSport('');
    setImages('');
    setFeaturesData(['']);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: 'Product Created Successfully Without Images',
    });
    setName('');
    setCategory('');
    setSKU('');
    setEditorHtml('');
    setQuantity('');
    setPrice('');
    setDiscount('');
    setBrand('');
    setSport('');
    setImages('');
    setFeaturesData(['']);
    setImages('');
  };
const [images, setImages] = useState([]);
const onChange = ({ fileList: newFileList }) => {
  setImages(newFileList);
};
const onPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};
  return (
    <div className='container-md mb-4'>
         {contextHolder}
      <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Create Product</Link></div>
      <h3 className='mb-4'>Create Product</h3>
      <div className='basic-information p-5 mb-3'>
        <h5 className='mb-3'>Basic Information</h5>
        <div className='mb-3'>
        <h6 className='mb-3'>Name</h6>
        <input class="form-control" type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Product Name"/>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <h6 className='mb-3'>Categories</h6>
            <Space style={{width: '100%',}} direction="vertical">
    <Select
    size='large'
      allowClear
      style={{
        width: '100%',
      }}
      placeholder="Select Categories"
      onChange={(value) => setCategory(value)}
      value={category}
    >
      {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.title}
            </Option>
          ))}
    </Select>
    </Space>
          </div>
          <div className='col'>
          <h6 className='mb-3'>Brand</h6>
          <Space style={{width: '100%',}} direction="vertical">
          <Select
          size='large'
          placeholder="Select Brand"
          style={{ width: '100%', }}
          onChange={(value) => setBrand(value)}
          value={brand}
          >
          {brands.map((brand) => (
            <Option key={brand.id} value={brand.id}>
              {brand.brandName}
            </Option>
          ))}
        </Select>
          </Space>
          </div>
          <div className='col'>
          <h6 className='mb-3'>Sport</h6>
          <Space style={{width: '100%',}} direction="vertical">
          <Select
          size='large'
          placeholder="Select Sport"
          style={{ width: '100%', }}
          onChange={(value) => setSport(value)}
        value={sport}
        >
          {sports.map((sport) => (
            <Option key={sport.id} value={sport.id}>
              {sport.sportName}
            </Option>
          ))}
        </Select>
          </Space>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <h6 className='mb-3'>SKU</h6>
            <div class="input-group">
  <input type="text" class="form-control" onChange={(e) => setSKU(e.target.value)} value={SKU} aria-label="SKU"/>
</div>
          </div>
          <div className='col'>
            <h6 className='mb-3'>Quantity</h6>
            <div class="input-group">
  <input type="number" class="form-control" min="0" required onChange={(e) => setQuantity(e.target.value)} value={quantity} aria-label="Quantity"/>
</div>
<span></span>
          </div>
          </div>
        <div> 
        <h6 className='mb-3'>Description</h6>
  <ReactQuill
value={editorHtml}
onChange={handleChange}
modules={modules}
formats={formats}
/>
        </div>
      </div>
      <div className='pricing p-5 mb-3'>
        <h5 className='mb-3'>Pricing</h5>
        <div className='row mb-3'>
          <div className='col'>
            <h6 className='mb-3'>Price</h6>
            <div class="input-group">
  <span class="input-group-text">$</span>
  <input type="number" step="0.01" class="form-control" min="0" required onChange={(e) => setPrice(e.target.value)} value={price} aria-label="Amount (to the nearest dollar)"/>
</div>
          </div>
          <div className='col'>
            <h6 className='mb-3'>Discount Price</h6>
            <div class="input-group">
  <span class="input-group-text">$</span>
  <input type="number" step="0.01" class="form-control" min="0" required onChange={(e) => setDiscount(e.target.value)} value={discount} aria-label="Amount (to the nearest dollar)"/>
</div>
          </div>
        </div>
      </div>
      <div className='features p-5 mb-3'>
      <h5 className='mb-3'>Features</h5>
      {featuresData.map((value, index) => (
        <div className='d-flex mb-3 gap-3' key={index}>
          <input
            type="text"
            class="form-control"
            value={value}
            onChange={(e) => handleInputChange(e.target.value, index)}
          />
          <button class="btn btn-danger" onClick={() => handleDeleteInput(index)}>Delete</button>
        </div>
      ))}
      <button class="btn btn-primary" onClick={handleAddInput}>+</button>
      </div>
        <Modal title="Add Images" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button style={{backgroundColor:'green'}} key="submit" type="primary" onClick={handleOk}>
          Add Images
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}>
         <div class="input-group">
         <ImgCrop rotationSlider>
      <Upload
        action='http://localhost:8081/upload'
        listType="picture-card"
        name="images"
        fileList={images}
        onChange={onChange}
        onPreview={onPreview}
      >
        {images.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
</div>
      </Modal>
        <div className='d-flex justify-content-end'> <button onClick={handleCreate} className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Product
      </button></div>
    </div>
  )
}

export default Addproducts