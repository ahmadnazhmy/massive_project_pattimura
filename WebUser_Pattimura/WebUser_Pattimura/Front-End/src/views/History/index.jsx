import './history.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import iconHolify from '../../assets/holify-icon.png';
import instagram from '../../assets/instagram.png';
import twitter from '../../assets/twitter.png';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Popup from '../component/Popup';
import Annotated from '../../assets/image-1719290484448.jpeg'; // Import the Popup component

const History = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3002/reports');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReports();
  }, []);

  const handleLogout = () => {
    // localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedReport(null);
  };

  // const truncateText = (text, maxLength) => {
  //   if (!text) return ''; // Handle case where text is undefined or null
  //   if (text.length <= maxLength) return text;
  //   return text.substring(0, maxLength) + '...';
  // };

  

  return (
    <div className='page'>
      <nav id='beranda'>
        <div className='section-navbar'>
          <img src={iconHolify} alt="icon" />
          <div className='section-list'>
            <h4 onClick={() => navigate('/')}>Beranda</h4>
            <h4 className='active'>Riwayat</h4>
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
        <div className='section-main-history'>
          <h2 style={{ textAlign: 'center' }}>Riwayat Laporan</h2>
          <p style={{ textAlign: 'center' }}>Laporan yang pernah dikirim oleh masyarakat</p>
        </div>
        
          {data.map(report => (
              <div key={report.idlaporan} className='section-history' onClick={() => handleReportClick(report)}>
                <div className='section'>
              
                    <img
                      src={Annotated}
                      alt="Annotated Report"
                    />
                    {/* <p>{report.photo}</p> */}
                  
                </div>
                <div className='desc'>
                  <h4>{report.location}</h4>
                  <div className='info'>
                    <p className='info-hole'>{report.category}</p>
                    <p className={`info-status ${report.status.toLowerCase()}`}>{report.status}</p>
                  </div>
                  <p className='description'>{report.description}</p>
                  <div className='rapporteur'>
                    <p>Oleh {report.nama_pengguna}</p>
                    <p>{new Date(report.laporan_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            ))}
        {isPopupVisible && (
          <Popup report={selectedReport} onClose={handleClosePopup} />
        )}
        <footer className='history-footer'>
          <div className='section-footer'>
            <div className='section-list'>
              <p onClick={() => navigate('/')}>Beranda</p>
              <p onClick={() => window.scrollTo(0, 0)}>Riwayat</p>
              <p onClick={() => navigate('/?faq')}>FAQ</p>
              <p onClick={() => navigate('/?aboutUs')}>Tentang Kami</p>
            </div>
            <div className='cpyright'>
              <p>@2024 Holify.com - All rights reserved</p>
            </div>
            <div className='sosmed'>
              <img src={instagram} alt="instagram" />
              <img src={twitter} alt="twitter" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default History;


