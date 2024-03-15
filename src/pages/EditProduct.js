import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Link, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Select, Space, Upload, Image, Option, message, Button, Modal } from 'antd';
import {BsPlusSquare} from 'react-icons/bs'
import ImgCrop from 'antd-img-crop';
import axios from 'axios';




function EditProduct() {
  const [messageApi, contextHolder] = message.useMessage();
//data
const {productId} = useParams();
const [name, setName] = useState('');
const [SKU, setSKU] = useState('');
const [quantity, setQuantity] = useState('');
const [price, setPrice] = useState('');
const [discount, setDiscount] = useState('');
const [category, setCategory] = useState('');
const [brand, setBrand] = useState('');
const [sport, setSport] = useState('');
useEffect(() => {
    axios.get(`http://localhost:8081/product/${productId}`)
      .then((res) => {
   setName(res.data.productName);
   setCategory(res.data.category);
   setEditorHtml(res.data.description);
   setBrand(res.data.brand);
   setSport(res.data.sport);
   setSKU(res.data.SKU);
   setQuantity(res.data.quantity);
   setPrice(res.data.price);
   setDiscount(res.data.discount);
      })
      .catch((err) => {
        console.error('Error fetching:', err);
      });
  }, []);
  useEffect(() => {
    axios.get(`http://localhost:8081/features/${productId}`)
      .then((res) => {
    setOldFeature(res.data)
    console.log(res.data)
      })
      .catch((err) => {
        console.error('Error fetching:', err);
      });
  }, []);
  useEffect(() => {
    axios.get(`http://localhost:8081/images/${productId}`)
      .then((res) => {
    setOldImages(res.data)
    console.log(res.data)
      })
      .catch((err) => {
        console.error('Error fetching:', err);
      });
  }, []);

const handleEdit = () => {
    const features = featuresData.map((value, index) => ({
        id: index + 1, // You can assign a unique ID here if needed
        feature_name: value,
      }));
  axios.put('http://localhost:8081/product/'+productId, {
      name: name, 
      SKU: SKU,
      description: editorHtml,
      quantity: quantity,
      price: price,
      discount: discount,
      category_id: category,
      brand_id: brand,
      sport_id: sport
    })
    .then(res =>  {
        axios.post('http://localhost:8081/feature/'+productId, {features: features})
        .then(res => {
            messageApi.open({
                type: 'success',
                content: 'Edit Product Success',
              })
              setTimeout(() => {
                window.location.reload();
              }, 500);
        }).catch((err) => {
            console.log(features)
            messageApi.open({
                type: 'warning',
                content: 'Error',
              })})
       
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
const [inputCount, setInputCount] = useState(0);
const [featuresData, setFeaturesData] = useState([null]); // Array to store input values
const [oldFeature, setOldFeature] = useState(['']);
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

  const handleDeleteOldInput = (id) => {
    axios.delete(`http://localhost:8081/feature/`+ id)
    .then (res => {
        console.log(featuresData);
      messageApi.open({
        type: 'success',
        content: 'Feature Deleted',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
      messageApi.open({
        type: 'warning',
        content: 'Delete',
      });
      console.error(err)
    })
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
//Upload Image
const [images, setImages] = useState([]);
const [oldImages, setOldImages] = useState([]);
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
const handleDeleteImage = (id) => {
    axios.delete(`http://localhost:8081/images/`+ id)
    .then (res => {
      messageApi.open({
        type: 'success',
        content: 'Image Deleted',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((err) => {
        console.log(err)
      messageApi.open({
        type: 'warning',
        content: 'Cant delete image id ' + id,
      });
      console.error(err)
    })
}
  return (
    <div className='container-md mb-4'>
         {contextHolder}
      <div className='link'><Link to='/admin'>Dashboard</Link><Link to="/admin/product-list"> / Product List</Link><Link> / Edit Product</Link></div>
      <h3 className='mb-4'>Edit Product</h3>
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
  <input type="number" class="form-control" onChange={(e) => setQuantity(e.target.value)} value={quantity} aria-label="Quantity"/>
</div>
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
  <input type="number" step="0.01" class="form-control" onChange={(e) => setPrice(e.target.value)} value={price} aria-label="Amount (to the nearest dollar)"/>
</div>
          </div>
          <div className='col'>
            <h6 className='mb-3'>Discount Price</h6>
            <div class="input-group">
  <span class="input-group-text">$</span>
  <input type="number" step="0.01" class="form-control" onChange={(e) => setDiscount(e.target.value)} value={discount} aria-label="Amount (to the nearest dollar)"/>
</div>
          </div>
        </div>
      </div>
      <div className='features p-5 mb-3'>
      <h5 className='mb-3'>Features</h5>
      {oldFeature.map((feature) => (
        <div className='d-flex mb-3 gap-3' key={feature.id}>
          <input
            type="text"
            class="form-control"
            disabled
            value={feature.feature_name}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button class="btn btn-danger" onClick={(e) => handleDeleteOldInput(feature.id)}>Delete</button>
        </div>
      ))}
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
      <div className='features p-5 mb-3'>
        <h5 className='mb-3'>Product Gallery</h5>
        <div className='row mb-3 align-items-center justify-content-between'> {oldImages.map((image) => (
        <div className='col gap-3 mb-3 align-items-center justify-content-between' key={image.id}>
            <div className='mb-3 align-items-center justify-content-between'>
            <Image className='object-fit-contain mb-3' width={200} height={200}  src={image.productImage}/>
        </div>
                
          <button class="btn btn-danger" onClick={(e) => handleDeleteImage(image.id)}>Delete</button>
      </div>
            
      ))}</div>
       
         <ImgCrop rotationSlider>
      <Upload
        action={`http://localhost:8081/upload/${productId}`}
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
        <div className='d-flex justify-content-end'> <button onClick={handleEdit} className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Edit Product
      </button></div>
    </div>
  )
}

export default EditProduct