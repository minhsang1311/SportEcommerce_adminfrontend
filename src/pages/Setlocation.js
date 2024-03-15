import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import { Select, Upload, message, Modal, Button } from 'antd';
import ReactQuill from 'react-quill';
import ImgCrop from 'antd-img-crop';
import {BsPlusSquare} from 'react-icons/bs';
import axios from 'axios';

function Setlocation() {
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  //data
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
  //Upload Image
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: 'Product Created Successfully',
    });
    setName('');
    setEditorHtml('');
    setQuantity('');
    setPrice('');
    setLongitude('');
    setAddress('');
    setSelectedPlace('')
    setSport('');
    setImages('');
    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = '';
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    messageApi.open({
      type: 'success',
      content: 'Product Created Successfully Without Images',
    });
    setName('');
    setEditorHtml('');
    setAddress('');
    setQuantity('');
    setPrice('');
    setLongitude('');
    setSelectedPlace('')
    setSport('');
    setImages('');
    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = '';
    }
  };
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
  //map
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteInputRef = useRef(null);

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ58HOhQa6XQzXJQxBbD5xGG3MHPyunjk&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 21.0278, lng: 105.8342 }, // Initial center
      zoom: 13, // Initial zoom level
    });

    const autocompleteInput = document.getElementById('autocomplete-input');
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput);

    // Add a place changed event listener to the autocomplete
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        // Update the selectedPlace state with the selected place data
        setSelectedPlace({
          address: place.formatted_address,
          latitude: location.lat(),
          longitude: location.lng(),
        });
        setAddress(place.formatted_address)
        setLatitude(location.lat())
        setLongitude(location.lng())
        placeMarkerAndPanTo(location, map)
        // Update the map's center based on the selected place's location
        map.setCenter(location);
      }
    });
  };
  const placeMarkerAndPanTo = (latLng, map) => {
    new window.google.maps.Marker({
      position: latLng,
      map: map,
    });
    map.panTo(latLng);
  }
  
  //create
  const [name, setName] = useState('');
const [address, setAddress] = useState('');
const [quantity, setQuantity] = useState('');
const [price, setPrice] = useState('');
const [longitude, setLongitude] = useState('');
const [latitude, setLatitude] = useState('');
const [sport, setSport] = useState('')
  const handleCreate = (e) => {
axios.post('http://localhost:8081/location', {
name: name,
address: address,
latitude: latitude,
longitude: longitude,
price: price,
quantity: quantity,
description: editorHtml,
sport_id: sport,
}).then((res) => {
  setIsModalOpen(true);
}).catch((err) => 
{console.log(err)
  messageApi.open({
  type: 'warning',
  content: 'Error',
});});
  }
  return (
    <div className='set-location container-md'>
      {contextHolder}
       <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Create Location</Link></div>
      <h3 className='mb-4'>Add New Location</h3>
    <div>
    <div className='mb-3' ref={mapRef} style={{ width: '100%', height: '600px' }}></div>
    <div className='basic-information p-5 mb-3'>
    <h5 className='mb-3'>Basic Information</h5>
        <div className='mb-3 row'>
          <div className='col mb-3'>
          <h6 className='mb-3'>Name</h6>
      <input
      class="form-control"
        type="text"
        placeholder="Name"
        value={name} onChange={(e) => setName(e.target.value)}
      />
          </div>
          <div className='col mb-3'>
          <h6 className='mb-3'>Address</h6>
          <input
       class="form-control"
       ref={autocompleteInputRef}
        id="autocomplete-input"
        type="text"
        placeholder="Address"
      />
          </div>
          <div className='col mb-3'>
          <h6 className='mb-3'>Sport</h6>
          <Select
          size='large'
          onChange={(value) => setSport(value)}
          value={sport}
          placeholder="Select Sport"
          style={{ width: '100%', }}
          >
          {sports.map((sport) => (
            <Option key={sport.id} value={sport.id}>
              {sport.sportName}
            </Option>
          ))}
        </Select>
          </div>
          </div>
          <div className='row mb-3'>
          <div className='col'>
            <h6 className='mb-3'>Price</h6>
            <div class="input-group">
  <span class="input-group-text">$</span>
  <input type="number" step="0.01" class="form-control" onChange={(e) => setPrice(e.target.value)} value={price} aria-label="Amount (to the nearest dollar)"/>
</div>
          </div>
          <div className='col'>
            <h6 className='mb-3'>Quantity</h6>
            <div class="input-group">
  <input type="number" onChange={(e) => setQuantity(e.target.value)} value={quantity} class="form-control" aria-label="Quantity"/>
</div>
          </div>
          </div>
        <div className='mb-3'> 
        <h6 className='mb-3'>Description</h6>
  <ReactQuill
value={editorHtml}
onChange={handleChange}
modules={modules}
formats={formats}
/>
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
        action='http://localhost:8081/uploadImage'
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
          </div>
    <div className='d-flex justify-content-end'> <button onClick={handleCreate} className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Location
      </button></div>
  </div>
  </div>
  )
}

export default Setlocation