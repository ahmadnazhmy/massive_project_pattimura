import React, { useState } from 'react';
import axios from 'axios';

const PopupCategoryCard = ({ item, onClose }) => {
  const [newStatus, setNewStatus] = useState(item.status); // State untuk menyimpan status baru

  const handleChangeStatus = async (newStatus) => {
    console.log('ID Laporan yang akan diubah statusnya:', item.idlaporan);
    try {
      const response = await axios.put(`http://localhost:3002/reports/${item.idlaporan}/status`, { status: newStatus });
      if (response.status === 200) {
        alert(response.data.message); // Alert pesan berhasil dari server
        setNewStatus(newStatus); // Update status lokal di frontend
      } else {
        alert('Failed to update status. Please try again.'); // Alert gagal umum
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with a non-2xx status:', error.response.data);
        console.error('Status code:', error.response.status);
        alert(`Failed to update status: ${error.response.data.message}`); // Menampilkan pesan kesalahan dari server
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to update status. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Failed to update status. Please try again.');
      }
    }
  };
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className='card-photos'>
          <img src={item.annotatedImageUrl} alt="Annotated Report" />
        </div>
        <div className='card-desc'>
          <h3>{item.location}</h3>
          <p>{item.description}</p>
        </div>
        <div className="status-buttons">
          <button
            className={`status-button Selesai ${newStatus === 'Selesai' ? 'active' : ''}`}
            onClick={() => handleChangeStatus('Selesai')}
          >
            Selesai
          </button>
          <button
            className={`status-button Diproses ${newStatus === 'Diproses' ? 'active' : ''}`}
            onClick={() => handleChangeStatus('Diproses')}
          >
            Diproses
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupCategoryCard;
