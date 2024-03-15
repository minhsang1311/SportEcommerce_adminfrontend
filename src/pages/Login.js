import React, {useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messageError, setMessageError] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081', { email, password })
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate(`/admin`);
       } else {
          setMessageError(res.data.Message);
        }
      })
      .catch((err) => console.log(err));
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
    <div className='login'>
      <div className='my-5 w-25 bg-white rounded-3 mx-auto p-3'>
        <Link to='/' className='d-flex justify-content-center'><img src='./Logoadmin2.png' style={{maxWidth: "60%"}}/></Link>
        <p className='text-center'>Login to your account to continue!</p>
        <form onSubmit={handleLogin}>
        <div class="form-floating mb-3">
<input type='email' class='form-control email' id='email' value={email}
        onChange={(e) => setEmail(e.target.value)} placeholder='Email Address'/>
<label htmlFor='Email Address'>Email Address</label>
</div>
<div class="form-floating mb-3">
<input type='password' class='form-control password' id='password' value={password}
        onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
<label htmlFor='Password'>Password</label>
</div>
<span className="text-danger mb-3">{messageError}</span>
        <div className='mb-3 text-end'>
          <Link to='/forgot-password' >Forgot Password?</Link>
        </div>
        <button className='border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5' style={{background: '#febd69' }} type='submit'>Login</button>
        </form>
         {/* Render the ErrorModal component when showErrorModal is true */}
      </div>
    </div>
    </div>
  )
}

export default Login