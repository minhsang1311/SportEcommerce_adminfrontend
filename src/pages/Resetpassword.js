import React, {useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New Password and Confirm Password do not match.');
      return;
    }
    // Send a request to your backend to reset the password
    axios
      .post('http://localhost:8081/reset-password', {
        resetToken: token,
        newPassword: newPassword,
      })
      .then((res) => {
        if(res.data.Message === 'Password Reset Successful') {
          setMessage(res.data.Message);
          navigate('/');
        }
        setMessage(res.data.Message);
      })
      .catch((error) => {
        setMessage('An error occurred');
        console.error(error);
      });
  };
  return (
    <div className='py-5' style={{background:"#febd69", minHeight:"100vh"}}>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    <div class-name='login'>
      <div className='my-5 w-25 bg-white rounded-3 mx-auto p-3'>
        <Link to='/' className='d-flex justify-content-center'><img src='./Logoadmin2.png' style={{maxWidth: "60%"}}/></Link>
        <p className='text-center'>Please Enter your new password.</p>
        <form onSubmit={handleResetPassword}>
        <div class="form-floating mb-3">
<input type='password'   value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required class='form-control new-password' id='new-password' placeholder='New Password'/>
<label htmlFor='New Password'>New Password</label>
</div>
<div class="form-floating mb-3">
<input type='password' class='form-control confirm-password'  value={confirmPassword}onChange={(e) => setConfirmPassword(e.target.value)} required id='confirm-password' placeholder='Confirm Password'/>
<label htmlFor='Confirm Password'>Confirm Password</label>
</div>
<span className="text-danger mb-3">{message}</span>
        <button className='border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5' style={{background: '#febd69' }} type='submit'>Reset Password</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default ResetPassword