import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  axios.defaults.withCredentials = true;
  const handleResetPassword = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/forgot-password', {email})
      .then((res) => {
          setMessage(res.data.Message);
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
    <div class-name='login'>
      <div className='my-5 w-25 bg-white rounded-3 mx-auto p-3'>
        <Link to='/' className='d-flex justify-content-center'><img src='./Logoadmin2.png' style={{maxWidth: "60%"}}/></Link>
        <p className='text-center'>Please Enter your register email to get reset password mail.</p>
        <form action=''>
        <div class="form-floating mb-3">
<input type='email' class='form-control email' value={email} onChange={(e) => setEmail(e.target.value)} id='email' placeholder='Email Address'/>
<label htmlFor='Email Address'>Email Address</label>
</div>
<span className="text-danger mb-3">{message}</span>
        <button onClick={handleResetPassword} className='border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5' style={{background: '#febd69' }} type='submit'>Send Link</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Forgotpassword