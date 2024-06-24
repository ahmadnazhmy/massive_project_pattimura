import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconText from '../../assets/holify-text.png';
import imgCar from '../../assets/car2.png';
import imgGoogle from '../../assets/google.png';
import Axios from 'axios';
import './register.scss';

const Register = () => {
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    telp: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const createUser = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post('http://localhost:3002/register', formData);

      if (response.status === 200) {
        // Save user data in Local Storage
        localStorage.setItem('registeredUser', JSON.stringify({ email: formData.email, password: formData.password }));
        setShouldNavigate(true);
      }
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/login');
    }
  }, [shouldNavigate, navigate]);

  return (
    <div className='page'>
      <div className='section-login'>
        <div className='left-side'>
          <img src={iconText} alt="icon" onClick={() => navigate('/')} />
          <img className='img-btm' src={imgCar} alt="car2" />
          <h5>Lengkapi data diri anda untuk melanjutkan pendaftaran</h5>
        </div>
        <div className='right-side'>
          <div className='options-register'>
            <h4 onClick={() => navigate('/login')}>Masuk</h4>
            <h4 className='active'>Daftar</h4>
          </div>
          <form onSubmit={createUser}>
            <label htmlFor='name'>Nama Lengkap</label>
            <input type="text" id='name' value={formData.name} onChange={handleInputChange} required />
            <div className='double-box-input'>
              <div className='left-box'>
                <label htmlFor='username'>Username</label>
                <input type="text" id='username' value={formData.username} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor='telp'>Nomor Telepon</label>
                <input type="text" id='telp' value={formData.telp} onChange={handleInputChange} required />
              </div>
            </div>
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' value={formData.email} onChange={handleInputChange} required />
            <label htmlFor='password'>Password</label>
            <input type="password" id='password' value={formData.password} onChange={handleInputChange} required />
            <button className='btn-login' type='submit'>Daftar</button>
          </form>
          <p>Atau lanjut dengan</p>
          <img className='img-google' src={imgGoogle} alt="google" />
        </div>
      </div>
    </div>
  );
}

export default Register;
