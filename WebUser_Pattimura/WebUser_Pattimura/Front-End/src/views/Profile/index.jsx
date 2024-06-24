import './profile.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconHolify from '../../assets/holify-icon.png';
// import imgProfile from '../../assets/profile.png';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  // const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState({
    iduser: '',
    name: '',
    email: '',
    username: '',
    telp: '',
    newPassword: '', // Ensure all fields are initialized
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedIduser = localStorage.getItem('iduser');
    if (storedIduser) {
      setUserData(prevState => ({ ...prevState, iduser: storedIduser }));
      fetchUserProfile(storedIduser); // Fetch initial profile data
    }
  }, []);

  const fetchUserProfile = async (iduser) => {
    try {
      console.log(`Fetching profile for user: ${iduser}`); // Debug log
      const response = await fetch(`http://localhost:3002/api/profile?iduser=${iduser}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const profileData = await response.json();
      setUserData(prevState => ({
        ...prevState,
        name: profileData.data.name || '',
        email: profileData.data.email || '',
        username: profileData.data.username || '',
        telp: profileData.data.telp || '',
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };
  
  // const handleProfilePictureChange = (e) => {
  //   const file = e.target.files[0];
  //   setProfilePicture(URL.createObjectURL(file));
  // };

  // const handleRemoveProfilePicture = () => {
  //   setProfilePicture(null);
  // };

  const handleSaveChanges = async () => {
    try {
      const { iduser, name, email, username, telp, newPassword } = userData;

      const response = await fetch('http://localhost:3002/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iduser, name, email, username, telp, newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile data');
      }

      alert('Perubahan berhasil disimpan.');
      fetchUserProfile(iduser);
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
    setUsername(null);
    navigate('/login');
  };

  return (
    <div className='page'>
      <nav id='beranda'>
        <div className='section-navbar'>
          <img src={iconHolify} alt="icon" />
          <div className='section-list'>
            <h4 onClick={() => navigate('/')}>Beranda</h4>
            <h4 onClick={() => navigate('/history')}>Riwayat</h4>
            <h4 onClick={() => navigate('/?faq')}>FAQ</h4>
            <h4 onClick={() => navigate('/?aboutUs')}>Tentang Kami</h4>
          </div>
          <div className='section-btn-login'>
            {username ? (
              <>
                <button onClick={() => navigate('/profile')}>Hi, {username}</button>
                <button className='btn-logout' onClick={handleLogout}><LogoutRoundedIcon /></button>
              </>
            ) : (
              <button onClick={() => navigate('/login')}>Masuk</button>
            )}
          </div>
        </div>
      </nav>
      <main>
        <div className='section-profile'>
          <h3>Edit Profil</h3>
          <div className='content-profile'>
            <div className='left-side'>
              <label htmlFor="name">Nama Lengkap</label>
              <input type="text" id='name' value={userData.name} onChange={handleInputChange} />
              <label htmlFor="email">Email</label>
              <input type="email" id='email' value={userData.email} onChange={handleInputChange} />
              <label htmlFor="newPassword">Password Baru</label>
              <input type="password" id='newPassword' value={userData.newPassword} onChange={handleInputChange} />
            </div>
            <div className='center-side'>
              <div className='center-input'>
                <label htmlFor="username">Username</label>
                <input type="text" id='username' value={userData.username} onChange={handleInputChange} />
                <label htmlFor="telp">Nomor Telepon</label>
                <input type="number" id='telp' value={userData.telp} onChange={handleInputChange} />
              </div>
              <button onClick={handleSaveChanges}>Simpan</button>
            </div>
            {/* <div className='right-side'>
              <img src={profilePicture || imgProfile} alt="profile" className='profile-picture' />
              <div className='section-btn-profile'>
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ display: 'none' }} id="upload-button" />
                <button onClick={() => document.getElementById('upload-button').click()}>Ganti</button>
                <button onClick={handleRemoveProfilePicture}>Hapus</button>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
