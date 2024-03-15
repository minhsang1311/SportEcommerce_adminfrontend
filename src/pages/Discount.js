import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { DatePicker, message } from 'antd';
import {BsPlusSquare} from 'react-icons/bs'
import axios from 'axios';
function Discount() {
  const [messageApi, contextHolder] = message.useMessage();
  //data
  const [code, setCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleCreate = (e) => {
    if (!code) {
      messageApi.open({
        type: 'warning',
        content: 'Code is required',
      });
      return;
    }
    e.preventDefault();
    axios.post('http://localhost:8081/coupon', {
      code: code, 
      type: typeCoupon, 
      value: couponValue,
      usage_limit: usageLimit,
      status: selectedStatus,
    })
    .then(res => {
      setCode('')
      setCouponValue('')
      setUsageLimit('')
      setSelectedStatus('Enable')
      setTypeCoupon('')
      messageApi.open({
        type: 'success',
        content: 'Coupon Created Successfully',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch((err) => {
      messageApi.open({
      type: 'error',
      content: 'Error',
    });});
  }
  //Type Coupon
  const [typeCoupon, setTypeCoupon] = useState('');
  const handleSelectType = (event) => {
    const selectedValue = event.target.value;
    setTypeCoupon(selectedValue);
  };
  //status 
  const [selectedStatus, setSelectedStatus] = useState('Enable');
  const handleSelectStatus = (value) => {
    const selectedValue = value.target.value;
    setSelectedStatus(selectedValue);
  };
  // Logic to map selectedOption to the input value
  let inputValue = '';
  if (typeCoupon === 'Percentage') {
    inputValue = '%';
  } else if (typeCoupon === 'Fixed Amount') {
    inputValue = '$';
  } else if (typeCoupon === 'Free Shipping') {
    inputValue = '$';
  }

  return (
    <div className='container-md mb-4'>
      {contextHolder}
      <div className='link'><Link to='/admin'>Dashboard</Link><Link> / Create Coupon Discount</Link></div>
      <h3 className='mb-4'>Create Coupon Discount</h3>
      <div className='basic-information p-5 mb-3'>
        <h5 className='mb-3'>Basic Information</h5>
        <div className='mb-3'>
        <h6 className='mb-3'>Code</h6>
        <input class="form-control" value={code} onChange={(e) => setCode(e.target.value)} type="text" placeholder="Coupon Code" aria-label="Coupon Code"/>
        </div>
        <div className='row mb-3 gap-3'>
          <div className='col'>
            <h6 className='mb-3'>Type</h6>
            <select class="form-select mb-3"  aria-label="Coupon Type" onChange={handleSelectType} value={typeCoupon}>
  <option selected>Coupon Type</option>
  <option value="Percentage">Percentage</option>
  <option value="Fixed Amount">Fixed amount</option>
  <option value="Free Shipping">Free shipping</option>
</select>
            <h6 className='mb-3'>Status</h6>
            <select class="form-select mb-3"  defaultValue="Enable" aria-label="Coupon Status" onChange={handleSelectStatus} value={selectedStatus}>
  <option value="Enable">Enable</option>
  <option value="Disable">Disable</option>
</select>
          </div>
          <div className='col'>
            <h6 className='mb-3'>Discount Value</h6>
            <input class="form-control mb-3" type="number" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} placeholder={inputValue} aria-label="Discount Value" disabled={selectedStatus === 'DISABLE'}/>
            <h6 className='mb-3'>Usage limit</h6>
            <input class="form-control mb-3" type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="$" aria-label="Discount Value" disabled={selectedStatus === 'DISABLE'}/>
           
          </div>
          </div>
        <div className='d-flex justify-content-end'> <button onClick={handleCreate} className='btn btn-success btn-lg mb-3'>
      {<BsPlusSquare />} Create New Coupon
      </button></div>
      </div>
    </div>
  )
}

export default Discount