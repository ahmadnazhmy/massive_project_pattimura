import './login.scss';
import { useNavigate } from 'react-router-dom';
import iconText from '../../assets/holify-text.png';
import imgCar from '../../assets/car2.png';
import imgGoogle from '../../assets/google.png';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      const response = await axios.post('http://localhost:3002/login', { email, password });

      if (response.status === 200) {
        const { username, iduser } = response.data;
        localStorage.setItem('username', username);
        localStorage.setItem('iduser', iduser); // Simpan id user di local storage
        navigate('/'); // Redirect ke halaman utama setelah login berhasil
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Email atau password salah.');
      } else {
        console.error('Error authenticating user:', error.response ? error.response.data : error.message);
        setErrorMessage('Terjadi kesalahan saat mengautentikasi pengguna.');
      }
    }
  };

  return (
    <div className='page'>
      <div className='section-login'>
        <div className='left-side'>
          <img src={iconText} alt="icon" onClick={() => navigate('/')} />
          <img className='img-btm' src={imgCar} alt="car2" />
          <h5>
            Jika kamu belum memiliki akun
            kamu bisa <span onClick={() => navigate('/register')}>Daftar disini!</span>
          </h5>
        </div>
        <div className='right-side'>
          <div className='options-login'>
            <h4 className='active'>Masuk</h4>
            <h4 onClick={() => navigate('/register')}>Daftar</h4>
          </div>
          <form onSubmit={handleLogin}>
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' required />
            <label htmlFor='password'>Password</label>
            <input type="password" id='password' required />
            {errorMessage && <p className='error-message'>{errorMessage}</p>} {/* Menampilkan pesan kesalahan */}
            <button className='btn-login' type='submit'>Masuk</button>
          </form>
          <p>Atau lanjut dengan</p>
          <img className='img-google' src={imgGoogle} alt="google" />
        </div>
      </div>
    </div>
  );
}

export default Login;
